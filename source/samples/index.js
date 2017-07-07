var trg = document.getElementById('target');
EW.Engy.configSet({componentsUrl : "/samples/components"});
EW.Engy.render({
	target : trg,
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
		text : 'back'
	}]
});