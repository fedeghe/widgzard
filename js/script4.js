(function (){

    var common = {
        width:'100%',
        height : '400px',
        border: '2px solid black',
        marginTop : '20px'
    },
    delayedDone = function (){ var self = this; window.setTimeout(function () {console.debug(self.innerHTML); self.resolve(); }, 1000); },
    trg = document.getElementById('container');

    function generateCountdownJson(n, o) {
        
        if (n < 0) return o;
        /*
        o = o || {
            html : n,
            cb : delayedDone
        };
        */
        return o ? generateCountdownJson(n - 1, {
                target : trg,
                cb : delayedDone,
                html : n,
                content : [o]
            }) : 
            generateCountdownJson (n-1, {
                target : trg,
                html : n,
                cb : delayedDone
            });


    }


    console.dir(generateCountdownJson(5));

    Widgzard.render(generateCountdownJson(5));

    
})();