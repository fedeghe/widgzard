FG.Widgzard.render({
    target : document.getElementById('getsamples'),
    attrs : {'class':'round respfixed', id : 'getsamples'},
    style : {backgroundColor:'#ddd'},
    content : [{
        style : {
            padding:'10px',
            cursor:'pointer',
            textTransform : 'uppercase'
        },
        html : 'load some samples',
        cb : function () {
            FG.events.on(this.node, 'click', function (){
                FG.Widgzard.load('js/samples.js');
            });
            this.done();
        }
    }]
},true);