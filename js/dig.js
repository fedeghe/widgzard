(function () {

	// FG.events.ready(function () {

		var o = {
			/**
			 * YEAH NOW HERE
			 */
			target : document.getElementById('target2'),
			style : {
				fontFamily : 'verdana, sans'
			},
			content : [{
				component : 'test/base',
				params : {
					a:"Vicente goes to hollywood",
					b:2,
					one : {
						two : {
							three : {
								four : {
									five : {
										six : {
											seven : {
												eight : {
													nine : 'ten'
												}
											}
										}
									}
								}
							}
						}
					},
					arr : [
						{name:'a'},
						{name:'b'},
						{name:'c'}
					],
					doList : true
				}
			}]
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

		FG.engy2.render(o, true);

	// });
	
})();