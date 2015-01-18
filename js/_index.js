(function () {

    var randomColor = function () {
            return "#" + ((1 << 24) * Math.random() | 0).toString(16);
        },
        incr = 5,
        time = 10,
        shrinkFonts = function (t) {
            var self = this,
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
        padding = '10px';


    var conf = {
        //debug : true,
        cb :function () {
            console.log('done end');
            report();
        },
        style : {backgroundColor: color2},
        
        content : [{
            attrs : {'class' : 'round respfixed'},
            style : {
                backgroundColor : color1,
                padding : '20px',
                margin : margin + ' 0px',
                fontSize : '45px',
                lineHeight : '45px',
                height:'65px',
                fontWeight:'bold',
                overflow : 'hidden',
                fontFamily: "'Luckiest Guy', cursive"
            },
            content : [{
                style : {textAlign : 'right', 'float':'left', width: '50%',letterSpacing : '600px', textIndent:'-2000px'},
                html : 'Widg',
                tag : 'h1'
                ,cb : shrinkFonts
            },{
                style : {textAlign : 'left', 'float':'left', width: '50%', letterSpacing : '600px', textIndent:'600px'},
                html : 'Zard',
                tag : 'h1',
                data : {
                    name : 'federico'
                },
                cb : function () {
                    shrinkFonts.call(this, true);
                    //console.log(this.root);
                    //console.log(this.data.name);
                }
            },'clearer']

        },{
            attrs : {'class':'round respfixed'},
            style : {textAlign:'center', margin : '0 auto', backgroundColor : 'white', padding:'20px '+padding, border:'10px solid '+color1, fontSize:'30px'},
                
            content : [{
                style : {'float':'left', width : '30%', padding:padding + ' 0px'},
                html : '{JSON}'
            },{
                style : {'float':'left', width : '5%', padding:padding + ' 0px'},
                html : '<span class="mobi">&darr;</span><span class="dskt">&rarr;</span>' 
            },{
                attrs : {'class':'round'},
                style : {'float':'left', width : '30%',backgroundColor : color2, color : color0, height : '52px', padding:padding + ' 0px', fontFamily: "'Luckiest Guy', cursive", fontSize:'45px'},
                html : 'Widgzard'
            },{
                style : {'float':'left', width : '5%', padding:padding + ' 0px'},
                html : '<span class="mobi">&darr;</span><span class="dskt">&rarr;</span>' 
            },{
                style : {'float':'left', width : '30%', padding:padding + ' 0px'},
                html : 'HTML & JS & CSS'
            },'clearer']

        },{

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
                                FG.events.on(this, 'click', function (){
                                    Widgzard.load('js/samples.js');
                                });
                                this.done();
                            }
                        }]
                        
                    }]    
                },{
                    style : {width:'80%' ,'float':'left'},
                    content : [{
                        style : {padding:padding, fontSize:'25px', margin : spacing + ' 0px'},
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
            
            
        },{
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
                    style : {width:'44%' ,'float':'left'},
                    content : [{
                        attrs : {'class':'round respfixed'},
                        style : {margin:spacing, backgroundColor:'black', color:color1},
                        content : [{
                            style : {padding:padding},
                            html : Widgzard.htmlspecialchars(
                                "var $ = document.getElementById;\n"+
                                "Widgzard.render({\n"+
                                "   target : $('cnt'),\n" +
                                "   cb : function() {\n"+
                                "       console.log('all done');\n"+
                                "   },\n" +
                                "   content : [{\n" +
                                "       html : 'hello',\n" +
                                "       style : {color:'red'}\n"+
                                "   }, {\n" +
                                "       html : 'world',\n"+
                                "       style : {\n"+
                                "           color:'green',\n"+
                                "       }\n"+
                                "   }]\n" +
                                "});"
                            )
                        }]
                    }]    
                },{
                    style : {width:'4%' ,'float':'left', fontSize:'30px', textAlign:'center',lineHeight:'40px'},
                    html : '<span class="mobi">&darr;</span><span class="dskt">&rarr;</span>' 
                },{
                    
                    style : {width:'4%' ,'float':'left', textAlign:'center',lineHeight:'40px'},
                    content : [{
                        attrs : {'class':'round respfixed'},
                        style : {
                            margin:spacing,
                            backgroundColor: color1,
                            fontFamily: "'Luckiest Guy', cursive",
                            fontSize:'20px',
                            lineHeight:'55px',
                            height:'50px'
                        },  
                        html : '<span class="dskt">W</span><span class="mobi">WIDGZARD</span>'
                   }]
                },{
                   style : {width:'4%' ,'float':'left', fontSize:'30px', textAlign:'center',lineHeight:'40px'},
                   html : '<span class="mobi">&darr;</span><span class="dskt">&rarr;</span>' 
                },{
                    style : {width:'44%' ,'float':'left'},
                    content : [{
                        attrs : {'class':'round respfixed'},
                        style : {margin:spacing, color:color3, backgroundColor:color2a, padding:padding},
                        content : [{
                            
                            content : [{
                                html : Widgzard.htmlspecialchars('<div id="cnt">')
                            },{

                                attrs : {'class':'round'},
                                style : { backgroundColor:color2a, color:color0},
                                html : Widgzard.htmlspecialchars(
                                    "  <div style='color:red'>hello</div>\n" + 
                                    "  <div style='color:green'>world</div>"
                                ) 
                            },{
                               html : Widgzard.htmlspecialchars('</div>') 
                            }]  
                        }]
                    }]    
                },
                'clearer',{
                    tag:'hr',
                    style : {margin : padding + ' ' + spacing},
                    cb : function (){this.done();}
                },{
                    attrs : {'class':'round respfixed'},
                    style : {backgroundColor: color2a, margin : spacing, padding:padding, color : color0},
                    html : '<p>It smells a lot like <strong>overhead</strong> that`s clear! Fortunately that`s not all.<br/>'+
                        '<strong>What about the callbacks chain?</strong> I try to introduce it from a common point of view.<br />'+
                        'Even thinking about a single little section of a webpage (maybe a widget) let`s try to get an answer to the following question:</p>',
                    content : [{
                        attrs : {'class':'round respfixed'},
                        style : {fontWeight:'bold',backgroundColor: color1, padding:padding, color : black, lineHeight:'1.6em', textAlign:'center'},
                        html : 'How to trigger some postorder callbacks while creating the tree in preorder?'
                    }]
                }]
            }]
            
            
        },{
            attrs : {'class' : 'round respfixed'},
            html : 'WTF licence ~ Federico Ghedina ~ ' + (new Date).getFullYear() ,
            style : {
                backgroundColor : 'white',
                padding : padding,
                margin : margin + ' 0px'
            }
        }]
    };


    Widgzard.render(conf, true);

    function report () {
        window.JSON && console.log('json size : ' + JSON.stringify(conf).length);
        console.log('html size : ' + document.documentElement.innerHTML.length);
    }



})();