(function () {
    var Wid = getWidgzard(),
        trg = document.getElementById('trg'),
        App = {
            target: trg,
            data: {
                name: 'federico'
            },
            content: [{
                content: [{
                    tag: 'h1',
                    text: 'Widgzard',
                    attrs: { 'class': 'logo' },
                    style: { 'line-height': '260px' },
                    content: [{
                        tag: 'img',
                        style: { 'float': 'left' },
                        attrs: {
                            src: "media/img/logoXS.svg",
                        },
                        cb: function () {
                            var self = this,
                                $elf = self.node,
                                counter = 0;

                            Wid.Channel('ev').sub('CLICKED', function (action, e) {
                                Wid.events.eventTarget(e).innerText =
                                    'ouch ... You clicked me ' +
                                    ++counter + ' time' +
                                    (counter > 1 ? 's' : '');
                            });
                            self.done();
                        }
                    }, 'clearer']
                }, {
                    tag: 'p',
                    init: function () {
                        this.data = { name: 'Widgzard' };
                        return true;
                    },
                    html: `<h4>Hello magicians!!!</h4>
                                <p>I\`m "$name$", a <i>small</i> engine to render anything on a  webpage</p>`
                }]
            }, {
                attrs: {
                    id: 'container'
                },
                html :'inner',
                cb : function () {
                    console.log(this);
                    this.done();
                },
                onClick: function () {
                    console.log(this);
                    // this.render();
                }
            }]
        },

        subApp = {
            target: App.node,
            content: [{
                tag: 'span',
                html: 'click me please!',
                style: {
                    cursor: 'pointer'
                },
                onClick: function (e) {
                    Wid.Channel('ev').pub('CLICKED', e);
                }
            }]
        };

    Wid.Widgzard.render(App);
    Wid.Widgzard.render(subApp);
})();