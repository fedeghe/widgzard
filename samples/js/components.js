(function () {
	var o = {
		/**
		 * YEAH NOW HERE
		 */
		target : document.getElementById('target1'),

		content : [{
			tag : 'h1',
			text : 'i18n(survey/tellMeYourAge)'
		},{
			tag : 'p',
			style : {margin : '5px'},
			content : [{
				tag : 'span',
				text : String.fromCharCode(9654)
			},{
				tag : 'span',
				html : 'll',
				style : {
					letterSpacing : '0px',
					fontWeight : 'bold'
				}
			}]
		},{
			tag : 'b',
			text : 'hello LEVEL1',
			style : {
				backgroundColor : 'yellow',
				color : 'green'
			}
		},{
			text : 'HEI IO SONO solo TESTO',
			style : {
				backgroundColor : '#fede76',
				color : 'darkviolet',
				padding : '5px'
			}
		},{
			tag : 'div',
			content : [{
				component : 'test/base',
				params : {
					a : "Gabri goes to hollywood",
					bddd : {a:function () {}},
					doList : true,
					arr : [1, 2, 3, 4, 5],
					b : 2,
					one : {two : {three : {four : {five : {six : {seven : {eight : {nine : '<strong>finally ten</strong>'}}}}}}}}
				},
				style : {
					backgroundColor : 'orange',
					padding : '10px'
				}
			},{
				html : 'prova LEVEL1'
			}],
			style : {
				padding : '10px'
			}
		},{
			component : 'test/base2'
		},{
			tag : 'i',
			text : 'after LEVEL1',
			padding : {padding :'10px'}
		},{
			tag : 'p',
			text : 'HEI IO SONO TESTO',
			cb : function () {
				this.done();
			}
		}],
		style : {
			fontFamily : 'Verdana, sans',
			padding : '10px'
		},
		cb : function () {
			// this.report()
		}
	};

	FG.lang = 'it';

	FG.io.getJson('/i18n/' + FG.lang + '.json', function (lang) {
        FG.i18n.load(lang);
        FG.engy.render(o, true).then(function (p, r) {
			// console.debug(r[0])
		});
    });
	
})();