(function () {
    var target = document.getElementById('target'),
        Wid = getWidgzard();
    
    Wid.Widgzard.render({
        target : target,
        content : [{
            tag: 'h2',
            html: "Hello world!",
            onClick: function (e) {
                console.log('Context', this);
                console.log('Evento', event);
            },
            onFocus : function (e) {
                console.log('Context', this);
                console.log('Evento', event);
            }
        },{
            tag : 'form',
            attrs: {
                action: '',
                method: 'get'
            },
            content : [{
                tag : 'input',
                attrs : {
                    type: 'text',
                    name : 'mytext'
                }
            },{
                tag : 'button',
                attrs : {
                    type: 'submit'
                },
                html: 'submit'
            }],
            onSubmit: function (e) {
                return Wid.events.kill(e);
            }
        },{
            tag : 'p',
            cb : function () {
                var qs = Wid.object.fromQs();
                // this.render();
                if ('mytext' in qs) this.node.innerHTML = decodeURIComponent(qs.mytext);
                this.done();
            }
        },{
            tag : 'p',
            html : 'hello',
            onClick : function (e) {
                console.log(this)
                console.log(e)
            }
        }]
    });

    /**
     
EW.Widgzard.render(document.getElementById('target'), {
    tag: 'h2',
    html: "Hello world!"
});

     */
})();