(function () {

	var o = {
		content : [{
			tag : 'b',
			html : 'hello LEVEL1',
			style : {
				backgroundColor:'yellow',
				color:'green'
			}
		},{
			text : 'HEI IO SONO solo TESTO',
			style : {
				backgroundColor:'#fede76',
				color:'darkviolet',
				padding : '5px'
			}
		},{
			tag : 'div',
			content : [
				{
					component : 'test/base',
					params : {a:"tony volpon xe cuea",b:2},
				},
				{
					html : 'prova LEVEL1'
				}
			],
			style : {
				padding:'10px'
			}
		},{
			component : 'test/base2'
		},{
			tag : 'i',
			html : 'after LEVEL1',
			padding : {padding:'10px'}
		},{
			tag : 'p',
			text : 'HEI IO SONO TESTO'
		},{
			component : 'test/sub/a',
			params:{}
		},{
			component : 'test/sub/b',
			params:{}
		},{
			component : 'test/sub/sub/c',
			params:{}
		}],

		style : {
			fontFamily : 'Verdana, sans',
			padding:'10px'
		}
	};

	

	var t = +new Date;
	FG.engy.process( o ).then(function(p, r) {
		// if not specified is Body
		//
		r[0].target = document.getElementById('target1');
	    Widgzard.render(r[0], true);
	    console.log('t1: ' + (+new Date - t));

	});
})();