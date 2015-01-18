(function (){

    var common = {
            width:'100%',
            height : '400px',
            border: '2px solid black',
            marginTop : '20px'
        },
        delayedDone = function (){
            
            var self = this;
            window.setTimeout(function () {
                console.debug(self, self.innerHTML);

                // resolve all but root, it has no promise within
                self !== trg && self.done();
            }, 1000);
        },
        trg = document.getElementById('container'),
        generateCountdownJson = function (n, o, r) {
            if (n < 0) return o;
            r = {
                target : trg,
                cb : delayedDone,
                html : n
            };
            !!o && (
                r.content = [o]
            ); 
            return generateCountdownJson(n - 1, r);
        };

    // console.dir(generateCountdownJson(5));
    // 
    Widgzard.render(generateCountdownJson(5));
})();