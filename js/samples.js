Widgzard.render({
    target : document.getElementById('getsamples'),
    style : {padding : '20px'},
    content : [
        {
            tag : 'p',
            html : 'Some samples'
        },{
            tag : 'ul',
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
},true);