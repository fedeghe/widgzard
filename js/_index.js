(function () {

    var style = {
            backgroundColor : 'white',
            padding : '20px',
            marginTop : '20px'
        },
        randomColor = function () {
            return "#" + ((1 << 24) * Math.random() | 0).toString(16);
        },
        col_OR = 'rgba(256, 128, 0, 1)';

    Widgzard.render({
        style : {backgroundColor : 'green'},
        cb : function () {console.debug('END'); },
        content : [
            {
                attrs : {'class' : 'round'},
                style : {
                    backgroundColor : col_OR,
                    padding : '20px',
                    marginTop : '20px',
                    fontSize : '50px',
                    fontWeight:'bold'
                },
                html : 'Widgzard v. 0.1',
                tag : 'h1',
                cb : function () {
                    var self = this,
                        n = 0;
                    window.setInterval(function () {
                        self.style.color = randomColor();
                    }, 500);
                    this.done();
                }
            },{
                style : {
                    backgroundColor : 'white',
                    paddingRight : '20px',
                    paddingTop : '20px',
                    marginTop : '20px'
                },
                attrs : {'class' : 'round respfixed'},
                content : [
                    {

                        style : {
                            'float':'left',
                            width : '30%',

                        },
                        content : [{


                            attrs : {'class' : 'round'},
                            style : {
                                backgroundColor : '#ccc',
                                marginLeft:'20px'
                            },
                            content : [{
                                style : {padding : '20px'},
                                content : [
                                    {
                                        tag : 'p',
                                        html : 'Some samples'
                                    },{
                                        tag : 'ul',
                                        content : [
                                            {
                                                tag : 'li',
                                                content : [{
                                                    tag : 'a',
                                                    attrs : {href : 'sample1.html'},
                                                    html : 'sample1'
                                                }]
                                            },{
                                                tag : 'li',
                                                content : [{
                                                    tag : 'a',
                                                    attrs : {href : 'sample2.html'},
                                                    html : 'sample2'
                                                }]
                                            },{
                                                tag : 'li',
                                                content : [{
                                                    tag : 'a',
                                                    attrs : {href : 'sample3.html'},
                                                    html : 'sample3'
                                                }]
                                            }
                                        ]
                                    }
                                ]
                            }]


                        }]


                    },{
                        style : {
                            'float':'left',
                            width : '70%'
                        },
                        content : [{
                            style : {marginLeft:'20px'},
                            content : [
                                {
                                    tag : 'p',
                                    style : {fontSize:'30px'},
                                    html : 'Widgzard javascript module allows to'
                                },{
                                    tag : 'ul',
                                    content : [
                                        {
                                            tag : 'li',
                                            style : {backgroundColor : col_OR, padding:'10px'},
                                            attrs : {'class':'round'},
                                            html : 'Inject an arbitrary Dom tree within a DOMnode'
                                        },{
                                            tag : 'li',
                                            style : {backgroundColor : col_OR, padding:'10px'},
                                            attrs : {'class':'round'},
                                            html : 'create a chain of resolving callback, where the tree leaves are called immediately after being appended.'
                                        },{
                                            tag : 'li',
                                            style : {backgroundColor : col_OR, padding:'10px'},
                                            attrs : {'class':'round'},
                                            html : 'leaf DOMnode ancestors callback will be called only when all childs callback explicitly declare to have finished their maybe asynchronous work'
                                        }
                                    ]
                                },{
                                    tag : 'p',
                                    html : ''
                                }
                            ]
                        }]
                    },
                    'clearer'
                ]
            },{
                style : style,
                attrs : {'class' : 'round respfixed'},
                content : [{
                    style : {'float':'left', width: '45%', backgroundColor:'black', color: col_OR}, 
                    attrs : {'class':'round'},
                    content : [{
                        style : {padding:'10px'},
                        html : '<pre>'+
                            "Widgzard.render({\n"+
                            "   target : document.getElementById('container')\n" +
                            "   cb : function() {console.log('all done');},\n" +
                            "   content : [{\n" +
                            "       html : 'hello',\n" +
                            "       cb : function () {\n" +
                            "           var self = this;\n" +
                            "           window.setTimeout(\n"+
                            "               function (){ this.done();},\n"+
                            "               3000\n"+
                            "           );\n"+
                            "       }\n" +
                            "   }, {\n" +

                            "   }]\n" +
                            "});"+
                        '</pre>'
                    }]
                },{

                    style : {'float':'left', width: '10%', textAlign:'center', fontSize:'50px', letterSpacing:'30px'},
                    content : [
                        {

                            html : '&#8404;'
                        },{
                            style : {marginTop : '40px'},
                            html : '&#8405;'        
                        }
                    ]
                    
                },{
                    style : {'float':'left', width: '45%'},
                    content : [{
                        style : {backgroundColor:'rgba(0,200,0,.5)'},
                        attrs : {'class':'round'},
                        content : [{
                            style : {padding:'10px'},
                            html : '<pre>'+
                                "&lt;div id='container'&gt;&lt;/div&gt;"+
                            '</pre>'
                        }]
                    },{
                        html : '&#8615;',
                        style : {textAlign:'center', fontSize:'50px', letterSpacing:'30px'}
                    },{
                        style : {backgroundColor: col_OR},
                        attrs : {'class':'round'},
                        content : [{
                            style : {padding:'10px'},
                            html : '<pre>'+
                                "&lt;div id='container'&gt;&lt;/div&gt;"+
                            '</pre>'
                        }]
                    }]


                }, 'clearer']
            },{
                attrs : {'class' : 'round respfixed'},
                html : 'WTF licence ~ Federico Ghedina ~ ' + (new Date).getFullYear() ,
                style : {
                    backgroundColor : 'white',
                    padding : '20px',
                    margin : '20px 0px'
                }
            }
        ]
    }, true);

})();