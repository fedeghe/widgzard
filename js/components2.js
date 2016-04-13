(function () {

	// FG.events.ready(function () {

		var o = {
			/**
			 * YEAH NOW HERE
			 */
			target : document.getElementById('target2'),

			content : [{
				tag : 'p',
				style : {margin:'5px'},
				content : [{
					tag : 'span',
					text : String.fromCharCode(9654)
				},{
					tag : 'span',
					html : 'll',
					style : {
						letterSpacing : '0px',
						fontWeight:'bold'
					}
				}]
			},{
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
						a:"Vicente goes to hollywood",
						doList : true,
						arr : [1,2,3,4,5],
						b:2,
						one : {
							two : {
								three : {
									four : {
										five : {
											six : {
												seven : {
													eight : {
														nine : '<strong>ten</strong>'
													}
												}
											}
										}
									}
								}
							}
						}
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
			}
		};

			
		// var t1 = +new Date, t2;
		
		// FG.engy2.process( o ).then(function(p, r) {
			
		// 	// if not specified is Body
		// 	//
		// 	// r[0].target = document.getElementById('target2');
		    
		//     Widgzard.render(r[0], true);
		//     t2 = +new Date;
		//     console.log('t2: ' + (t2-t1));

		// });

		FG.engy2.render(o,true).then(function (p, r) {
			console.debug(r[0])
		});

	// });
	
})();