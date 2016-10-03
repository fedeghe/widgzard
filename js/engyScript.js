var timeStart = +new Date,
    timeEnd;

window.onload = function () {

    -function() {
        FG.engy3.process({
            component: "carousel",
            params: {
                id: "d23q2qdd2q243",

                layout: {
                    bgImage :'http://static.stailamedia.com/svp/interactive/images/1/1/800/526/http%253A%252F%252F25.media.tumblr.com%252Fec1ecfbc92e8673eeb18f9df2fb029a0%252Ftumblr_n2wsdoydBx1qkegsbo1_1280.jpg',

                    size: {
                        width: "462px",
                        height: "230px"
                    }

                    // brd: "0px solid black",

                    ,padding : '20px'
                    // ,button : {theme : 'default'}
                    // ,button : {theme : 'darkDefault'}
                    // ,button : {theme : 'whiteRound'}
                    // ,button : {theme : 'darkRound brdWhite'}
                     // ,orientation : 'vertical'
                    // ,ballList : true
                },
                
                link : "http://www.jmvc.dev",
                linkOut : true,
                speed : .3,
                cards: [

                    // {
                    //     component : "cards/storeLocator",
                    //     params : {
                    //         places : {}
                    //     }
                    // },

                    {
                        component: "cards/video",
                        params: {
                            oggUrl: "http://www.w3schools.com/html/mov_bbb.ogg"
                            ,mp4Url: "http://www.w3schools.com/html/mov_bbb.mp4"
                            ,autoplay : true
                            ,controls : true
                            
                            // ,onEnd : {
                            //     content : [{
                            //         tag : 'p',
                            //         html : 'The end',
                            //         style : {
                            //             color:'red',
                            //             textAlign :'center',
                            //             fontSize : '100px',
                            //             textTransform : 'uppercase'
                            //         }
                            //     }]
                            // }
                            
                            // ,onEnd : {
                            //     component: "cards/contactBasic",
                            //     params: {
                            //         submitUrl: "http://www.sm.dev/post.php"
                            //     }
                            // }
                            
                            // ,onEnd : {
                            //     component : "cards/modal",
                            //     params : {
                            //         html : '<h1>Hello World</h1><p>This is a simple description</p>'
                            //         // ,signedBy : 'Jochen'
                            //     }
                            // }
                        }
                    },


                    {
                        component: "cards/image-link",
                        params: {
                            imageUrl: "http://www.jmvc.org/media/img/jmvc_n2.png",
                            link: "http://www.jmvc.org?ga=false"
                        }
                    },


                    {
                        component: "cards/image-text-link",
                        params: {
                            imageUrl: "http://www.stailamedia.com/wp-content/themes/staila/images/logo4.svg",
                            text: "Greetings from",
                            link: "http://www.stailamedia.com"
                        }
                    },


                    {
                        component: "cards/video-text",
                        params: {
                            oggUrl: "http://www.w3schools.com/html/mov_bbb.ogg",
                            mp4Url: "http://www.w3schools.com/html/mov_bbb.mp4",
                            autoplay : true,
                            heading : "Let`s dance?",
                            text : 'Google announces <a target="_blank" href="https://www.google.com/atap/projecttango/#project">project Tango</a>'
                        }
                    },


                    {
                        component : 'cards/fb',
                        params : {
                            fbPageUrl: "https:\/\/www.facebook.com\/lidlch",
                            scrolling : 'yes',
                            colorscheme : 'light'
                        }
                    },


                    {
                        component: "cards/contactBasic",
                        params: {
                            submitUrl: "http://www.sm.dev/post.php"
                        }
                    },


                    {
                        component: "cards/poll",
                        params: {
                            submitUrl: "http://www.sm.dev/poll.php",
                            showGauge : true,
                            questionsAnswers: [{
                                name : 'rateType',
                                question : 'Do you charge on an hourly or project basis?',
                                multi : true,
                                answers : [
                                    'I charge hourly',
                                    'I charge flat project fees',
                                    'A mix of both'
                                ]
                            },{
                                name : 'hourlyRate',
                                question : 'What is your hourly rate?',
                                answers :[
                                    '$10-$49/hour',
                                    '$50-$99/hour',
                                    '$100-$149/hour',
                                    '+$150/hour'
                                ]
                            },{
                                name : 'yearIncome',
                                question : 'What is your income per year?',
                                answers : [
                                    '$50K-$100K/y',
                                    '$100K-$150K/y',
                                    '$150K-$250K/y',
                                    '+$250K/y'
                                ] 
                            }]
                        }
                    }
                ]
            }
        }).then(function(p, r) {
            // Get the engine generated target
            //
            var conf = r[0];

            // Add a target, if not body is used
            // and
            // all scripts tag will be removed
            // 
            conf.target = document.getElementById('trg1');

            // unleash the FG.Widgzard
            //
            FG.Widgzard.render(conf, true);
        });
    }();

};
