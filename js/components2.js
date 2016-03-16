(function () {

	var o = {
		content : [{
			tag : 'b',
			text : 'hello LEVEL1',
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
			content : [{
				component : 'test/base',
				params : {
					// a:"Vicente goes to hollywood",
					b:2
				},
				style : {
					backgroundColor : 'orange',
					padding:'10px'
				}
			},{
				html : 'prova LEVEL1'
			}],
			style : {
				padding:'10px'
			}
		},{
			component : 'test/base2'
		},{
			tag : 'i',
			text : 'after LEVEL1',
			padding : {padding:'10px'}
		},{
			tag : 'p',
			text : 'HEI IO SONO TESTO'
		}],
		style : {
			fontFamily : 'Verdana, sans',
			padding:'10px'
		},
		onAbort : function (r) {
			console.debug(r);
		}
	};

	

	var t1 = +new Date, t2;
	FG.engy2.process( o ).then(function(p, r) {
		
		// if not specified is Body
		//
		r[0].target = document.getElementById('target2');
	    
	    Widgzard.render(r[0], true);
	    t2 = +new Date;
	    console.log('t2: ' + (t2-t1));

	});
})();