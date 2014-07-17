!function (){

    var DOMstress = function (node) {
            node.leak = [];
            var t = 1000,
                tmp;
            for (var i = 0; i < t; i++) {
                tmp = document.createElement('div');
                tmp.innerHTML = +new Date;
                node.appendChild(tmp);
            }
        },
        trg = document.body,
        end = function () {
            console.debug('Done');
        },
        conf = [{
            style : {backgroundColor:'red'},
            content : [{
                tag : 'h1',
                html : 'HELLO I`M RED',
                attrs : {'class':'round'},
                style : {padding:'10px',margin : '20px 0px', fontSize:'30px',backgroundColor: '#FFF', color:'red'}
            },{
                tag : 'button',
                style : {margin : '20px 0px', padding : '10px'},
                html : 'go green',
                cb : function () {
                    this.addEventListener('click', swap, false);
                    DOMstress(document.body);
                    this.done();
                }
            }],
            cb : end
        },{
            style : {backgroundColor:'green'},
            content : [{
                tag : 'h1',
                html : 'HELLO I`M GREEN',
                attrs : {'class':'round'},
                style : {padding:'10px',margin : '20px 0px', fontSize:'30px',backgroundColor: '#000', color:'green'}
            },{
                tag : 'button',
                style : {margin : '20px 0px', padding : '10px'},
                html : 'go red',
                cb : function (){
                    this.addEventListener('click', swap, false);
                    DOMstress(document.body);
                    this.done();
                }
            }],
            cb : end
        }],
        index = 0,
        swap = function () {
            index = (index + 1) %2;
            render();
        },
        render = function () {
            Widgzard.render(conf[index], true);
        };

    render();

}();