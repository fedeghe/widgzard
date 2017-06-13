(function () {

	FG.engy.component('thePerson', {
		tag : 'p',
		content : [{
			tag : 'strong',
			text : "ma daaai #PARAM{theName} lo sapevi che "
		}, {
			tag : 'span',
			style : {color:'red'},
			text : 'hello world'
		}]
		
	});

	var o = {
		/**
		 * YEAH NOW HERE
		 */
		target : document.getElementById('target1'),

		content : [{
			tag : 'h1',
			text : 'i18n(survey/tellMeYourAge)'
		},{
			component : "thePerson",
			params : {
				theName : "my name is Federico"
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

	FG.io.getJson('/source/i18n/' + FG.lang + '.json', function (lang) {
        FG.i18n.load(lang);
        FG.engy.render(o, true).then(function (p, r) {
			// console.debug(r[0])
		});
    });
	
})();