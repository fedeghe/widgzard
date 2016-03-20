(function () {
	var o = {
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
		},{
			component : 'test/sub/a',
			params : {
				name : 'Gabriele'
			}
		},{
			component : 'test/sub/a',
			params : {
				name : 'Federico'
			}
		}]
	};

	FG.engy2.render(o, true);
})();