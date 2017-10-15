var trg = document.getElementById('target');

EW.Engy.configSet({
	componentsUrl: "/samples/components"
});

/**
 * predefine one component,
 * otherwise will be searched in the components configured folder
 * as /samples/components/h2.js
 */
EW.Engy.component('h2', {
	tag: 'h2',
	html : "#PARAM{html} <i style='color:#ddd;font-size:0.5em'>preloaded</i>",
	data : {
		times : 0
	},
	//init : function (){return true;},
	cb : function () {
		var self = this,
			$elf = self.node;
		EW.events.on($elf, 'click', function () {
			var times = ++self.data.times;
			$elf.innerHTML = 'clicked ' + times + " time" + (times == 1 ? "" : "s");
		});
		this.done();
		console.log('cb')
	},
	end : function (){
		console.log('end')
		console.log(this.node);
	}
});

EW.Engy.render({
	target: trg,
	data: {
		prova: ""
	},
	style: {
		"font-family": "Verdana,sans"
	},
	content: [{
		tag: "h1",
		html: "Hello world"
	},{
		component: "h2",
		params: {
			html: "I`m Federico"
		}
	},{
		tag: "a",
		attrs: {
			onclick: "history.back();"
		},
		style: {
			cursor: "pointer"
		},
		text: "back"
	},{
		tag : "p",
		init : function () {
			var self = this;
			self.data.time = new Date().toLocaleString();
			self.node.innerHTML = self.data.time;
			return true;
		},
		cb : function () {
			var self = this,
				$elf = self.node;
			setInterval(function (){
				self.data.time = new Date().toLocaleString();
				$elf.innerHTML = self.data.time;
			}, 1000);
			this.done();
		}
	},{
		tag: "span",
		html: "Try out the wwdb: "
	},{
		tag: "input",
		attrs: {
			"type": "text",
			"wwdb": "parent.data.prova"
		}
	},{
		tag: "p",
		style: {
			color: "red",
			fontWeight: "bold"
		},
		attrs: {
			"wwdb": "parent.data.prova"
		}
	}]
});