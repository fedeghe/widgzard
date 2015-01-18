Widgzard.render({
    target : document.getElementById('getsamples'),
    
    content : [
        {
            style : {padding:'10px', textTransform : 'uppercase', position:'relative'},
            html : 'Some samples',
            content:[{
                style : {
                    position : 'absolute',
                    right:'0px', top:'0px', width:'15px', height:'15px',
                    lineHeight:'8px',
                    fontSize:'10px',
                    fontWeight:'bold',
                    backgroundColor : 'black',
                    color:'white',
                    margin : '10px', padding:'2px',
                    border:'1px solid black',
                    textAlign : 'center',
                    cursor:'pointer'
                },
                attrs : {'class' : 'round respfixed'},
                html : 'X',
                cb : function () {
                    FG.events.on(this.node, 'click', function (){
                        Widgzard.load('js/samplesback.js');
                    });
                    this.done();
                }
            }]
        },{
            tag : 'ul',
            style : {padding:'10px'},
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
}, true);