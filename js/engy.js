/*
[MALTA] ../engy/config.js
*/
FG.makeNS('FG/engy');

FG.engy.config = {
    componentsUrl : '/engy/components/',
    lazyLoading : true
};

/*
[MALTA] ../engy/engy.js
*/
FG.engy.process = function () {

    var args = [].slice.call(arguments, 0),
        config = args[0],
        endPromise = Widgzard.Promise.create(),
        Processor, processorPROTO,
        getComponentsManager,
        outConfig = {};

    Processor = function (config) {
        this.components = [];
        this.retFuncs = [];
        this.config = config;
    };
    processorPROTO = Processor.prototype;

    processorPROTO.getComponents = function () {
        var self = this,
            tmp = FG.object.digForKey(self.config, 'component'),
            i, l;

        //build at level
        for (i = 0, l = tmp.length; i < l; i++) {
        
            if (!self.components[tmp[i].level])  {
                self.components[tmp[i].level] = [];
            }     
            self.components[tmp[i].level].push({
                component : tmp[i],
                params : FG.checkNS(tmp[i].container ?  tmp[i].container + '.params' : 'params' , self.config)
            });
        }
    }; 
    
    processorPROTO.getComponentsPromise = function () {
        var self = this,
            p = Widgzard.Promise.create(),
            i1, i2, l1, l2;

        self.getComponents();

        self.retFuncs = [];

        for (i1 = 0, l1 = self.components.length; i1 < l1; i1++) {

            // could be undefined @ that level
            if (self.components[i1]) {

                for (i2 = 0, l2 = self.components[i1].length; i2 < l2; i2++) {

                    (function (j1, j2) {

                        self.retFuncs.push(function () {

                            var pr = Widgzard.Promise.create(),

                                file = FG.engy.config.componentsUrl + self.components[j1][j2].component.value + '.js';
                    
                            // not get it as json , so it's possible to specify the cb within the component
                            // net being it validated from JSON.parse
                            FG.io.get(
                                file,
                                function (r) {
                                    self.components[j1][j2].json = eval('(' + r.replace(/\/n|\/r/g, '') + ')');
                                    //self.components[j1][j2].json = eval('(' + r + ')');
                                    pr.done();
                                }
                            );
                            return pr;
                        });
                    })(i1, i2);
                }    
            }
        }
        p.done();
        return p;
    };

    processorPROTO.run = function () {

        var self = this,
            tmp, i1, i2 , l1, l2;

        if (FG.engy.config.lazyLoading) { 
            self.getComponentsPromise().then(function () {


                var pZebra = self.retFuncs.length ?
                    // the component,params is explicitly speficfied
                    // 
                    Promise.join(self.retFuncs)
                    :
                    // or the json does not require a component at this level
                    // 
                    Promise.create();

                pZebra
                .then(function (pro) {
                    // let the build resolve it
                    // and his promise to return the result
                    // 
                    build(self, pro);
                }).then(function (p, r) {
                    endPromise.done(r[0].config);
                }).done();

                /*
                Widgzard.Promise.join(self.retFuncs).then(function (pro, r) {
                    
                    build(self, pro); // let the build resolve it

                }).then(function (p, r) {

                    endPromise.done(r[0].config);

                });
                */
            });
        } else {
            // get position
            self.getComponents();
            // now look into FG ns to get the missing json, the one loaded in lazy mode
            for (i1 = 0, l1 = self.components.length; i1 < l1 ; i1++) {
                if (self.components[i1]) {
                    for (i2 = 0, l2 = self.components[i1].length; i2 < l2; i2++) {
                        self.components[i1][i2].json = FG.components[self.components[i1][i2].component.value]; //FG.components;
                    }
                }
            }
            var p = Widgzard.Promise.create();
            p.then(function (p, r) {
                
                //console.debug(r[0]);

                endPromise.done(r[0].config);

            });
            build(self, p);
        }
    
    };

    function copyWithNoComponentNorParams(o) {
        var ret = {};
        for (var j in o) {
            if (!j.match(/params|component/)) {
                ret[j] = o[j];
            }
        }
        return ret;
    }

    function build(instance, pro) {

        //  in revese order the sostitution
        /*
         * {component: s1 , k1 : x1, k2: ,x2, .....} or 
         * {component: s1 , params: {}, k1 : x1, k2: ,x2, .....}
         *
         * will be at the end replaced with
         * {content : [ resulting ], k1 : x1, k2: ,x2, .....}
         * 
         */
        // localize config, that will be modified

        var components = instance.components,
            config = instance.config,
            k = components.length,
            i, l,
            comp, params, json, res,ref;
            solve = function (j, p) {

                // use 
                var replacing = FG.object.digForValue(j, /#PARAM{([^}|]*)?\|?([^}]*)}/),
                    i, l,
                    mayP, fback, ref,
                    ret;
                
                for (i = 0, l = replacing.length; i < l; i++) {

                    mayP = FG.checkNS(replacing[i].regexp[1], p),
                    fback = replacing[i].regexp[2],
                    ref = FG.checkNS(replacing[i].container, j);
                    if (mayP !== undefined) {
                        ref[replacing[i].key] = mayP;    
                    } else {
                        ref[replacing[i].key] = fback || false; //'{MISSING PARAM}';
                    }

                    // WANT SEE if some params are missing?
                    // !mayP && !fback && console.log("WARNING: missing parameter! " + replacing[i].regexp[1]);
                }
                // return a clean object
                // with no component & params
                return copyWithNoComponentNorParams(j);
            };
        // from the deepest, some could be empty
        while (k--) {
            if (components[k]) {
                for (i = 0, l = components[k].length; i < l; i++) {
                    comp = components[k][i];
                    params = comp.params;
                    json = comp.json;

                    res = solve(json, params);

                    ref = FG.checkNS(comp.component.parentContainer, config);
                    
                    if (comp.component.parentKey != undefined) {
                        ref[comp.component.parentKey] = res;
                    } else {
                        // root
                        instance.config = res;
                    }
                }
            }
        }
        
        pro.done(instance);
    }
    
    (new Processor(config)).run();
    return endPromise;
};