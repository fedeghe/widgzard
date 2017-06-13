(function () {

    var randomColor = function () {
            return "#" + ((1 << 24) * Math.random() | 0).toString(16);
        },
        shrinkFonts = function (t) {
            var self = this.node,
                n = 0;
            (function g (){
                window.setTimeout(function () {
                    var c = parseInt(self.style.letterSpacing, 10),
                        tInd = parseInt(self.style.textIndent, 10);
                    c -= incr;
                    self.style.letterSpacing = c + 'px';
                    if (t) self.style.textIndent = (tInd - incr) + 'px';
                    if (c > incr) {
                        g();
                    }
                }, time);
            })();
            this.done();
        },
        incr = 5,
        time = 10,
        color0 = '#FFFFFF',
        color1 = '#FF8800',
        color1a = '#FF8800',
        color2 = '#008800',
        color2a = '#008800',
        color3 = '#DDDDDD',
        black = '#000000',
        spaPX = 5,
        padPX = 10,
        spacing = spaPX + 'px',
        margin = 2 * spaPX + 'px',
        padding = '10px',
        conf = {
            //debug : true,
            cb :function () {
                console.log('done end');
                report();
            },
            style : {backgroundColor: color2},
            
            content : [{
                attrs : {"class" : "round respfixed top"},
                style : {
                    backgroundColor : color1,
                    padding : "20px",
                    margin : margin + " 0px",
                    // fontSize : "45px",
                    // lineHeight : "45px",
                    // height:"65px",
                    height:"auto",
                    fontWeight:"bold",
                    overflow : "hidden",
                    fontFamily: "'Luckiest Guy', cursive"
                },
                content : [{
                    style : {
                        textAlign : 'right',
                        'float':'left',
                        width: '50%',
                        letterSpacing : '600px',
                        textIndent:'-2000px'
                    },
                    attrs : {"class":"noPadding"},
                    html : 'Widg',
                    tag : 'h1',
                    cb : function () {
                        shrinkFonts.call(this, true);
                        //console.log(this.root);
                        //console.log(this.node.data.name);
                        //debugger;
                        
                    }
                },{
                    style : {textAlign : 'left', 'float':'left', width: '50%', letterSpacing : '600px', textIndent:'600px'},
                    attrs : {"class":"noPadding"},
                    html : 'Zard',
                    tag : 'h1',
                    data : {
                        name : 'federico'
                    },
                    cb : function () {
                        shrinkFonts.call(this, true);
                        //console.log(this.root);
                        //console.log(this.node.data.name);
                        //debugger;
                    },
                    end : function () {
                        console.log(this.node);
                    }
                },'clearer']
            },{
                tag : 'img',
                attrs : {
                    src : '/img/theWidgzard.svg'
                }
            },{
                attrs : {'class':'round respfixed'},
                style : {
                    textAlign:'center',
                    margin : '0 auto',
                    backgroundColor : 'white',
                    padding:'20px '+padding,
                    border:'10px solid '+color1
                },
                content : [{
                    style : {'float':'left', width : '30%', padding:padding + ' 0px'},
                    content : [{
                        tag : 'h3',
                        text : '{Object literal}'    
                    }]
                },{
                    style : {'float':'left', width : '5%', padding:padding + ' 0px'},
                    content : [{
                        tag : 'h3',
                        html : '<span class="mobi">&darr;</span><span class="dskt">&rarr;</span>'    
                    }]
                },{
                    attrs : {'class':'round'},
                    style : {
                        'float':'left',
                        width : '30%',
                        backgroundColor : color2,
                        color : color0,
                        letterSpacing : '.1em',
                        // height : '52px',
                        // height : '2em',
                        // padding:padding + ' 0px',
                        fontFamily: "'Luckiest Guy', cursive",
                        fontSize:'2em'
                        // ,lineHeight:'2em'
                    },
                    content : [{
                        tag : 'h4',
                        text : 'Widgzard'
                    }]
                },{
                    style : {'float':'left', width : '5%', padding:padding + ' 0px'},
                    content : [{
                        tag : 'h3',
                        html : '<span class="mobi">&darr;</span><span class="dskt">&rarr;</span>'
                    }]
                },{
                    style : {'float':'left', width : '30%', padding:padding + ' 0px'},
                    content : [{
                        tag :'h3',
                        text : 'HTML & JS & CSS'    
                    }]
                    
                },'clearer']
            },


            {
                attrs : {'class':'round'},
                style : {
                    margin : margin +' 0px',
                    backgroundColor:color0,
                    width:'100%'
                },
                content : [{
                    attrs : {'class':'respfixed'},
                    style : {padding:spacing},
                    content : [{
                        style : {width:'20%' ,'float':'left'},
                        content : [{
                            attrs : {'class':'round respfixed', id : 'getsamples'},
                            style : {margin:spacing, backgroundColor:color3},
                            content : [{
                                style : {padding:padding, cursor:'pointer', textTransform : 'uppercase'},
                                html : 'load some samples',
                                cb : function () {
                                    FG.events.on(this.node, 'click', function (){
                                        FG.Widgzard.load('js/samples.js');
                                    });
                                    this.done();
                                },
                                end : function () {
                                    console.log(this.node);
                                }
                            }]
                        }]  
                    },{
                        style : {width:'80%' ,'float':'left'},
                        content : [{
                            style : {
                                padding:padding,
                                // fontSize:'25px',
                                margin : spacing + ' 0px'
                            },
                            attrs : {'class':'respfixed'},
                            tag : 'h3',
                            html : 'Widgzard javascript module allows to'
                        }, {
                            attrs : {'class':'round respfixed'},
                            style : {margin:spacing, backgroundColor: color1a, padding:padding, lineHeight:'1.6em'},
                            html : 'Inject an arbitrary Dom tree within a DOMnode.'
                        }, {
                            attrs : {'class':'round respfixed'},
                            style : {margin:spacing, backgroundColor: color1a, padding:padding, lineHeight:'1.6em'},
                            html : 'Create a chain of resolving callback, where the tree leaves callbacks are called immediately after the node is appended.'
                        }, {
                            attrs : {'class':'round respfixed'},
                            style : {margin:spacing, backgroundColor: color1a, padding:padding, lineHeight:'1.6em'},
                            html : 'Leaf DOMnode ancestors callback will be called only when all childs callback explicitly declare to have finished their maybe asynchronous work.'
                        }]
                    },'clearer']
                }]
            },


            {
                attrs : {'class':'round'},
                style : {
                    margin : margin +' 0px',
                    backgroundColor:color0,
                    width:'100%'   
                },
                content : [{
                    attrs : {'class':'respfixed'},
                    style : {padding:spacing},
                    content : [{
                        wid : 'n1',
                        style : {width:'44%' ,'float':'left'},
                        content : [{
                            attrs : {'class':'round respfixed'},
                            style : {margin:spacing, backgroundColor:'black', color:color1},
                            content : [{
                                style : {padding:padding},
                                html : FG.Widgzard.htmlspecialchars(
                                    "FG.Widgzard.render({\n"+
                                    "   target : document.getElementById('cnt'),\n" +
                                    "   cb : function() {\n"+
                                    "       console.log('all done');\n"+
                                    "   },\n" +
                                    "   content : [{\n" +
                                    "       text : 'hello',\n" +
                                    "       style : {color:'red'}\n"+
                                    "   }, {\n" +
                                    "       html : '<u>world</u>',\n"+
                                    "       style : {color:'green'}\n"+
                                    "   }]\n" +
                                    "});"
                                )
                            }]
                        }] 
                    },{
                        wid : 'n2',
                        style : {
                            width:'4%' ,
                            'float':'left',
                            // fontSize:'30px',
                            textAlign:'center',
                            lineHeight:'40px'
                        },
                        html : '<h3 class="mobi">&darr;</h3><h3 class="dskt">&rarr;</h3>'
                    },{
                        style : {width:'4%' ,'float':'left', textAlign:'center',lineHeight:'40px'},
                        content : [{
                            attrs : {'class':'round respfixed'},
                            style : {
                                margin:spacing,
                                backgroundColor: color1,
                                fontFamily: "'Luckiest Guy', cursive"
                            },  
                            html : '<h3 class="dskt">W</h3><h3 class="mobi">WIDGZARD</h3>'
                        }]
                    },{
                        style : {
                            width:'4%' ,
                            'float':'left',
                            // fontSize:'30px',
                            textAlign:'center'
                        },
                        html : '<h3 class="mobi">&darr;</h3><h3 class="dskt">&rarr;</h3>'
                    },{
                        style : {width:'44%' ,'float':'left'},
                        content : [{
                            attrs : {'class':'round respfixed'},
                            style : {margin:spacing, color:color3, backgroundColor:color2a, padding:padding},
                            content : [{
                                content : [{
                                    html : FG.Widgzard.htmlspecialchars('<div id="cnt">')
                                },{
                                    attrs : {'class':'round'},
                                    style : { backgroundColor:color2a, color:color0},
                                    html : FG.Widgzard.htmlspecialchars(
                                        " <div style='color:red'>hello</div>\n" + 
                                        " <div style='color:green'><u>world</u></div>"
                                    ) 
                                },{
                                    html : FG.Widgzard.htmlspecialchars('</div>')
                                }]
                            }]
                        }]
                    },
                    'clearer',{
                        tag:'hr',
                        style : {margin : padding + ' ' + spacing}
                    },{
                        attrs : {'class':'round respfixed'},
                        style : {backgroundColor: color2a, margin : spacing, padding:padding, color : color0},

                        // html : '<p>It smells a lot like much <strong>overhead</strong> added! Fortunately that`s not all.',
                        content : [{
                            tag : 'h4',
                            text : "Doesn`t it smess a lot like a huge amount of overhead data? Moreover, to produce a big document the object literal could quickly get crazy huge and unmantainable!"
                        },{
                            attrs : {'class':'round respfixed'},
                            style : {
                                fontWeight:'bold',
                                backgroundColor: color1,
                                padding:padding, color : black,
                                lineHeight:'1.6em',
                                textAlign:'center'
                            },
                            html : 'How to trigger some postorder callbacks while creating the tree in preorder?'
                        }]
                    }]
                }]
            },{
                attrs : {'class' : 'round respfixed'},
                html : "WTF<sup>SUP</sup> WTF<sub>SUB</sub>"
            },{
                attrs : {'class' : 'round respfixed'},
                html : 'WTF licence ~ Federico Ghedina ~ ' + (new Date).getFullYear() ,
                style : {
                    backgroundColor : 'white',
                    padding : padding,
                    margin : margin + ' 0px'
                },
                end : function () {
                    console.log(this.node);
                }
            }]
        };
    

    FG.Widgzard.render(conf, true, 'tony');

    function report () {
        window.JSON && console.log('json size : ' + JSON.stringify(conf).length);
        console.log('html size : ' + document.documentElement.innerHTML.length);
    }



})();