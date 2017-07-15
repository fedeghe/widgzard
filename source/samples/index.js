var trg = document.getElementById('target');
EW.Engy.configSet({componentsUrl : "/samples/components"});
EW.Engy.render({
	target : trg,
	style : {
		"font-family" : "Verdana,sans"
	},
	content : [{
		tag : "h1",
		html : "Hello world"
	},{
		component : 'h2',
		params : {
			html : "I`m Federico"
		}
	},{
		tag : 'a',
		attrs : {
			onclick : "history.back();"
		},
		style : {
			"cursor" : "pointer"
		},
		text : 'back'
	}]
});