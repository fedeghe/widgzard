(function () {



    var conf = {
            content : [{
                tag : 'ul',
                content : [{
                    tag : 'li',
                    content : [{
                        tag : 'img',
                        wid : 'rajaimage',
                        attrs : {
                            src : 'http://www.jmvc.dev/media/img/jmvc_n2.png'
                        },
                        cb : function () {
                            console.log('cb')
                            var self = this,
                                $elf = self.node;

                            $elf.onload = function (){
                                self.done();
                            };

                            FG.events.on($elf, 'click', function () {
                                FG.Channel('speaker').pub('image_clicked', ['hello Raja', 'Your flight is delayed', 0,1,2,3,4,5,6]);
                            })
                            
                        },
                        init : function () {
                            console.log('init')
                            return true;
                        },
                        end : function () {
                            console.log('end')
                            this.getNode('mynode').node.innerHTML = 'Hello Raja';
                        }
                    }]
                },{
                    tag : 'li',
                    content : [{
                        tag : 'p',
                        wid : 'mynode',
                        text : 'hello',
                        style : {
                            color: 'blue'
                        }
                    }]
                }]
            }]
        },



        r1 = FG.Widgzard.render(conf, true),

        r2 = FG.Widgzard.render({
            content : [{
                tag : 'p',
                html : 'hello Federico',
                cb : function () {
                    var self = this,
                        $elf = self.node;
                    FG.Channel('speaker').sub('image_clicked', function (t, title, message){
                        console.debug(arguments)
                        $elf.innerHTML = '<b>' + title + '</b>: ' + message

                        FG.events.on($elf, 'mouseover', function () {
                            r1.getNode('rajaimage').node.src = 'http://www.freakstyle.it/img/image2.php?im=CIMG3000.jpg';
                        })

                    });
                    this.done();
                }
            }]

        });




})();