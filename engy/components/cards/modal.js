{
    data : {
        appendMode : true
    },
    content : [{
        style : {
            position:'absolute',
            margin : '0 auto',
            height:'80%',
            width:'80%',
            left:'10%',
            top:'10%',
            zIndex:900,
            backgroundColor:'#ddd'
        },
        attrs : {
            "class":"round10 respfixed"
        },
        content : [{
                html : '#PARAM{html}',
                style:{
                    padding:'10px'
                }
            },{
                html : '#PARAM{signedBy}',
                style : {
                    fontSize : '8px',
                    textAlign:'right',
                    position:'absolute',
                    bottom:'5px',
                    right:'5px',
                    fontStyle : 'italic'
                },
                data : {
                    visible : '#PARAM{signedBy}'
                },
                cb : function () {
                    if (!this.data.visible) {
                        this.node.style.display = 'none';
                    }
                    this.done();
                }
            },{
                html : 'x',
                style : {
                    color:'white',
                    position:'absolute',
                    backgroundColor:'#555',
                    width:'20px',
                    height:'20px',
                    lineHeight:'16px',
                    left:'-10px',
                    top:'-10px',
                    fontSize : '17px',
                    cursor:'pointer',
                    textAlign:'center'
                },
                attrs : {
                    "class":"round10 respfixed"
                },
                cb : function () {
                    var self = this;
                    FG.events.on(self.node, 'click', function () {
                        FG.dom.remove(self.parent.node);
                    });
                    self.done();
                }
            }
        ]
    }]
}