/* eslint-disable no-console */
(function () {
    var target = document.getElementById('trg'),
        App = {};

    App.main = function (state) {
        Engy.render({
            target: target,
            content: [{
                tag: 'h1',
                html: 'Home page'
            }, {
                tag: 'p',
                html: 'Est sit ut enim non veniam incididunt ullamco incididunt deserunt laborum ipsum Lorem. Ea cupidatat labore elit sit minim pariatur ut quis. Laboris sit occaecat id aliqua eiusmod aliqua dolore.'
            }, {
                tag: 'span',
                text: 'details',
                attrs: { href: '#' },
                onClick: function () {
                    console.log('clickkkkkkk');
                    App.detail({ name: 'federico', n: 1 });
                    // Widgzard.events.unhandle(this);
                }
            }],
            route: 'spa',
            title: 'spa',
            cb: function () {
                console.log(this);
                console.log(state);
                console.log(this.report());
                console.log('================================');
                this.done();
            }
        }, true);
    };

    App.detail = function (state) {
        Engy.render({
            target: target,
            data: [
                'Officia reprehenderit mollit laborum dolor. Ut in nisi eiusmod dolor. Non labore labore non mollit officia id mollit. Qui ex commodo sit commodo consequat aliquip cupidatat nulla amet. Sunt Lorem magna dolor velit reprehenderit.',
                'Est enim ipsum dolor amet proident elit aliqua eu. In elit consequat esse nostrud duis minim velit dolore qui amet elit magna et. Dolor mollit sunt dolore ut excepteur cillum. Lorem non nulla reprehenderit magna mollit in duis.',
                'Cillum aliqua tempor consectetur est. Deserunt quis nostrud velit commodo nisi ipsum cillum sit deserunt tempor Lorem occaecat. Amet consequat nisi est deserunt eu ut id in ad consectetur nisi. Laborum pariatur tempor nisi quis consectetur est officia reprehenderit. Tempor qui aute reprehenderit laborum aliqua ad id consequat reprehenderit enim dolore officia quis commodo.',
                'Ipsum cupidatat quis aliqua cillum amet nisi elit dolore Lorem dolore. Consequat ullamco dolore eu ullamco esse commodo non aute. Qui et adipisicing officia cillum. Irure dolore quis ad eu aliqua in consectetur sint ullamco ut ad deserunt veniam cupidatat. In dolore culpa voluptate irure aliqua et exercitation eiusmod fugiat laborum irure quis incididunt ipsum. Et laboris pariatur reprehenderit nulla pariatur reprehenderit commodo exercitation nostrud velit dolor. Laboris anim deserunt ut reprehenderit nisi cillum commodo.',
                'Tempor adipisicing consequat eu pariatur id veniam dolore amet mollit reprehenderit non. Anim commodo nostrud excepteur eu qui consectetur nulla. Sunt tempor ad cillum eu laboris sunt ad sunt nulla eu labore. Laborum do quis aliquip veniam voluptate pariatur nisi exercitation labore mollit esse enim. Officia quis adipisicing id fugiat ad irure qui commodo est aute commodo voluptate.',
                'Incididunt laborum laboris duis quis qui eu qui officia ut tempor qui tempor aliqua reprehenderit. Minim labore ex voluptate aliquip elit Lorem laboris enim reprehenderit in sunt cillum. Labore ex sunt exercitation pariatur sint ipsum non sunt est tempor labore ad fugiat dolore.',
                'Ullamco adipisicing commodo consectetur ex laborum id dolore id dolore cupidatat esse. Voluptate anim dolor fugiat reprehenderit irure eiusmod irure exercitation anim eiusmod officia eiusmod. Ad deserunt est quis aliqua consequat. Tempor reprehenderit aliquip proident amet velit sunt qui tempor in aliqua excepteur laboris.'
            ],
            content: [{
                tag: 'h1',
                text: 'Details'
            }, {
                tag: 'ul',
                content: function () {
                    return this.parent.data.map(function (el) {
                        return {
                            tag: 'li',
                            html: el
                        };
                    });
                }
            }, {
                html: 'back',
                tag: 'span',
                style: {
                    color: 'green',
                    cursor: 'pointer',
                    display: 'inline-block'
                },
                onMouseover: function () {
                    this.node.innerHTML = 'click here to go back';
                },
                onClick: function () {
                    App.main({ cognome: 'ghedina' });
                }
            }, {
                tag: 'p',
                data: {
                    n: state.n
                },
                html: 'reload $n$',
                style: { color: 'red' },
                onClick: function () {
                    // rerender all?
                    App.detail({ n: this.data.n + 1 });
                    // or the node
                    // this.render();
                },
                end: function () {
                    // console.log(this.data.n)
                    // if (this.data.n < 50) this.node.click();
                }
            }],
            route: 'detail',
            title: 'detail',
            init: function () {
                // this.conf.route = 'xczczxczx';
                // this.conf.title = 'title xczczxczx';
                return true;
            },
            cb: function () {
                console.log(state);
                console.log(this.report());
                console.log('================================');
                this.done();
            }
        }, true);
    };
    App.main({ just: 'the beginning' });
})();
