(function () {

    var randomColor = function () {
            return "#" + ((1 << 24) * Math.random() | 0).toString(16);
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
        widgzard = {
            img : '/img/theWidgzard.svg'
        },
        conf = {
            //debug : true,
            cb :function () {
                console.log('done end');
                report();
            },
            style : {backgroundColor: "#555"},
            content : [{
                style : {
                    textAlign:'center',
                    margin : '1em 0'
                },
                content : [{
                    tag : 'img',
                    attrs : {
                        src : widgzard.img,
                        "class" : "g14"
                    }
                }]
            },{
                attrs : {
                    'class':'round8 respfixed pad1'
                },
                style : {
                    backgroundColor : color3
                },
                content : [{
                    content : [{
                        tag : 'p',
                        attrs : {
                            "class" : "floatl p50"
                        },
                        content : [{
                            tag : 'h2',
                            attrs : {"class" : "p100"},
                            html : '... Father, I promise!'
                        },{
                            tag : 'p',
                            html : 'The main purpose of the <i><b>Widgzard</b></i> is to allow the creation of anything a webpage, or a subtree of it, can show, only using one or more <b>object literals</b>.'
                        },{
                            tag : 'p',
                            html : 'These elements can safely be considered <i><u>web components</u></i> honouring the <b>DRY</b> rule.'
                        }]
                    },{
                        attrs : {
                            "class" : "round8 floatr p50 pad1"
                        },
                        style : {
                            backgroundColor: 'white'
                        },
                        content : [{
                            tag : 'h3',
                            html :'Key features'
                        },{
                            tag : 'hr'
                        },{
                            tag : 'ul',
                            wid : 'ul',
                            content : [{
                                component : 'li',
                                params : {content : "<a target='_blank' href='http://www.wtf.com'>wtf.com</a>"}
                            },{
                                tag : 'li',
                                html : '&raquo; Builds markup at the speed of light.'
                            },{
                                tag : 'li',
                                html : '&raquo; You have complete control on Nodes, before, during and after their creation.'
                            },{
                                tag : 'li',
                                html : '&raquo; You can use your favourite libraries, or even go <b>vanilla</b>'
                            },{
                                tag : 'li',
                                html : '&raquo; It is <i>components</i> friendly'
                            },{
                                tag : 'li',
                                html : '&raquo; Components can comunicate one with each other'
                            },{
                                tag : 'li',
                                html : '&raquo; Shipped with a minimal css library'
                            }]
                        }]
                    },'clearer']
                }]
            },{
                tag : 'h3',
                style : {
                    color:'white',
                    textAlign:'center'
                },
                html : 'This page and all related features and samples are created just invoking the <pre>Widgzard.render</pre> function',

            },{
                attrs : {
                    'class':'round8 respfixed'
                },
                style : {
                    textAlign:'center',
                    margin : '0 auto',
                    backgroundColor : 'white',
                    padding:'2em ' + padding,
                    marginTop : '1em'
                    // border:'1em solid '+color1
                },
                content : [{
                    style : {
                        'float' : 'left',
                        width : '30%',
                        padding : padding + ' 0px'
                    },
                    content : [{
                        tag : 'h3',
                        text : '{Object literal}'    
                    }]
                },{
                    style : {
                        'float' : 'left',
                        width : '5%',
                        padding : padding + ' 0px'
                    },
                    content : [{
                        tag : 'h3',
                        html : '<span class="mobi">&darr;</span><span class="dskt">&rarr;</span>'    
                    }]
                },{
                    attrs : {'class':'round8'},
                    style : {
                        'float':'left',
                        width : '30%',
                        backgroundColor : color1,
                        color : color0,
                        letterSpacing : '.1em'
                    },
                    content : [{
                        tag : 'h3',
                        text : 'the Widgzard'
                    }]
                },{
                    style : {
                        'float' : 'left',
                        width : '5%',
                        padding : padding + ' 0px'
                    },
                    content : [{
                        tag : 'h3',
                        html : '<span class="mobi">&darr;</span><span class="dskt">&rarr;</span>'
                    }]
                },{
                    style : {
                        'float' : 'left',
                        width : '30%',
                        padding : padding + ' 0px'
                    },
                    content : [{
                        tag :'h3',
                        text : 'HTML & JS & CSS'    
                    }]
                    
                },'clearer']
            },{
                attrs : {'class':'round8'},
                style : {
                    margin : margin +' 0px',
                    backgroundColor : color0,
                    width : '100%'
                },
                content : [{
                    attrs : {
                        'class':'respfixed'
                    },
                    style : {
                        padding : spacing
                    },
                    content : [{
                        wid : 'n1',
                        style : {
                            width : '44%' ,
                            'float' : 'left'
                        },
                        content : [{
                            attrs : {
                                'class' : 'round8 respfixed'
                            },
                            style : {
                                margin : spacing,
                                backgroundColor : 'black',
                                color : color1
                            },
                            content : [{
                                style : {
                                    padding : padding
                                },
                                html : FG.Widgzard.htmlspecialchars(
                                    "FG.Widgzard.render({\n"+
                                    "   target : document.getElementById('cnt'),\n" +
                                    "   cb : function() {\n"+
                                    "       console.log('all done');\n"+
                                    "   },\n" +
                                    "   content : [{\n" +
                                    "       text : 'hello',\n" +
                                    "       attrs : {class:'first'}\n"+
                                    "   }, {\n" +
                                    "       html : '<u>world</u>',\n"+
                                    "       attrs : {class:'second'}\n"+
                                    "   }]\n" +
                                    "});"
                                )
                            }]
                        }] 
                    },{
                        wid : 'n2',
                        style : {
                            width : '4%' ,
                            'float' : 'left',
                            textAlign : 'center',
                            lineHeight : '40px'
                        },
                        content : [{
                            tag : 'h3',
                            attrs : {"class":"mobi"},
                            html : '&darr;'
                        },{
                            tag : 'h3',
                            attrs : {"class":"dskt"},
                            html : '&rarr;'
                        }]
                    },{
                        style : {
                            width : '4%',
                            'float' : 'left',
                            textAlign : 'center',
                            lineHeight : '40px'
                        },
                        content : [{
                            attrs : {
                                'class' : 'round8 respfixed'
                            },
                            style : {
                                margin : spacing,
                                backgroundColor : color1,
                                fontFamily : "'Luckiest Guy', cursive"
                            },  
                            content : [{
                                tag : 'h3',
                                attrs : {"class":"dskt"},
                                text : 'W'
                            },{
                                tag : 'h3',
                                attrs : {"class":"mobi"},
                                text : 'WIDGZARD'
                            }]
                        }]
                    },{
                        style : {
                            width : '4%' ,
                            'float' : 'left',
                            textAlign : 'center'
                        },
                        content : [{
                            tag : 'h3',
                            attrs : {"class":"mobi"},
                            html : '&darr;'
                        },{
                            tag : 'h3',
                            attrs : {"class":"dskt"},
                            html : '&rarr;'
                        }]
                        
                    },{
                        style : {
                            width : '44%',
                            'float' : 'left'
                        },
                        content : [{
                            attrs : {
                                'class' : 'round8 respfixed'
                            },
                            style : {
                                margin : spacing,
                                color : color3,
                                backgroundColor : color2a,
                                padding : padding
                            },
                            content : [{
                                content : [{
                                    html : FG.Widgzard.htmlspecialchars('<div id="cnt">')
                                },{
                                    attrs : {
                                        'class' : 'round8'
                                    },
                                    style : {
                                        backgroundColor : color2a,
                                        color : color0
                                    },
                                    html : FG.Widgzard.htmlspecialchars(
                                        " <div class='first'>hello</div>\n" + 
                                        " <div class='second'><u>world</u></div>"
                                    ) 
                                },{
                                    html : FG.Widgzard.htmlspecialchars('</div>')
                                }]
                            }]
                        }]
                    },
                    'clearer', {
                        tag : 'hr',
                        style : {
                            margin : padding + ' ' + spacing
                        }
                    },{
                        tag : "h4",
                        html :"Isn`t it going to be crazy huge as far as my document grows?",
                        attrs : {
                            "class" : "round4 floatl"
                        },
                        style : {
                            backgroundColor : color1,
                            margin : spacing,
                            padding : padding,
                            color : color0
                        }
                    },{
                        attrs : {
                            'class' : 'round4 floatr'
                        },
                        style : {
                            backgroundColor : color2a,
                            margin : spacing,
                            padding : padding,
                            color : color0,
                            marginTop : '2em'
                        },
                        tag : 'h4',
                        text : "... maybe, but the `components` solve this"
                    },'clearer']
                }]
            },{
                tag : 'h2',
                attrs : {
                    'class' : 'round8 respfixed'
                },
                html : "Before showing how <i>components</i> works ..."
            },{
                attrs : {
                    'class' : 'round8 respfixed'
                },
                html : 'WTF licence ~ Federico Ghedina ~ ' + (new Date).getFullYear() ,
                style : {
                    backgroundColor : 'white',
                    padding : padding,
                    margin : margin + ' 0px'
                }/*,
                end : function () {
                    console.log(this.node);
                }*/
            }]
        };
    

    // window.t = FG.Widgzard.render(conf, true, 'tony');
    window.t = FG.engy3.render(conf, true, 'tony');
    // window.t = FG.engy3.load('http://www.widgzard.dev/json/index.js');
    /*FG.engy3.get(conf).then(function (p, r) {
        document.body.appendChild(r[0]);
    });
    */
    function report () {
        window.JSON && console.log('json size : ' + JSON.stringify(conf).length);
        console.log('html size : ' + document.documentElement.innerHTML.length);
    }
})();