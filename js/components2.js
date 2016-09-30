(function () {
	var o = {
		/**
		 * YEAH NOW HERE
		 */
		target : document.getElementById('target1'),

		content : [{
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
		}],
		style : {
			fontFamily : 'Verdana, sans',
			padding : '10px'
		}
	};




    FG.engy3.render(o,true).then(function (p, r) {
		console.debug(r[0])
	});

	
})();