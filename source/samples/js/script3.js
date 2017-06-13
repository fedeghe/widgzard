(function (){
    var pieces = {
        white : {
            king : '&#9812;',
            queen : '&#9813;',
            tower : '&#9814;',
            alf : '&#9815',
            horse : '&#9816',
            ped : '&#9817;'
        },
        black : {
            king : '&#9818;',
            queen : '&#9819;',
            tower : '&#98120;',
            alf : '&#9821;',
            horse : '&#9822;',
            ped : '&#9823;'  
        }
    },
    // again cause of ie
    keys = ['king', 'queen', 'tower', 'alf', 'horse', 'ped'];

    FG.Widgzard.render({
        target : document.getElementById('container'),
        content : [{
            style : {border : '3px solid green', overflow : 'hidden'},
            attrs : {
                'class':'checker'
            },
            cb : generate
        }],
        cb : finalize


    });
    


    function generate() {
        var SELF = this, // here not needed but... good habit
            s = 8,
            c = 0;
        for (var i = 0, tmp; i < s*s; i++) {
            
            if(i > 0 && !(i%s)) {
                tmp = document.createElement('br');
                tmp.className = 'clearer';
                SELF.node.appendChild(tmp); 
                c++;    
            }

            tmp = document.createElement('div');
            tmp.className = 'square ' + (c % 2 ? 'w' : 'b');
            tmp.innerHTML = pieces.white[keys[Math.floor(Math.random() * 6)] ];
            SELF.node.appendChild(tmp);
            c++;
            
        }
        SELF.done();
    }

    function finalize() {
        console.log('GENERATED')
    }


})();