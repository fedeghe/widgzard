var start = +new Date,
    end;
!function (){

    var DOMstress = function (node) {
            node.leak = [];
            var t = 10000,
                tmp;
            for (var i = 0; i < t; i++) {
                tmp = document.createElement('div');
                tmp.className = "bg" + i%2;
                (function (j) {
                    tmp.addEventListener('click', function (){alert(j); }, false);
                })(i);
                tmp.innerHTML = "<strong>" +  i + "</strong> :  " +  +new Date;
                node.appendChild(tmp);
            }
        },
        trg = document.body,
        end = function () {
            console.log('Done');
            DOMstress(document.body);
            stats();
        },
        conf = [{
            style : {backgroundColor:'red'},
            content : [{
                tag : 'h1',
                html : 'HELLO I`M RED',
                attrs : {'class':'round'},
                style : {padding:'10px',margin : '20px 0px', fontSize:'30px',backgroundColor: '#FFF', color:'red'},
                cb: function () {
                    this.done();
                } 
            },{
                tag : 'button',
                style : {margin : '20px 0px', padding : '10px'},
                html : 'go green',
                cb : function () {
                    this.node.addEventListener('click', swap, false);
                    
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
                    FG.events.on(this.node,'click', swap);
                    this.done();
                }
            }],
            cb : end
        }],

        index = 0,
        
        swap = function () {
            start = +new Date;
            index = (index + 1) %2;
            render();
        },
        
        render = function () {
            FG.Widgzard.render(conf[index], true);
        },
        
        stats = function (){
            window.JSON && console.log('json size : ' + JSON.stringify(conf).length);
            console.log('html size : ' + document.documentElement.innerHTML.length);
            end = +new Date();
            console.log('TTR : ' + (end - start));
        };

    render();

}();