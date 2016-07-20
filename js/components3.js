(function () {
	var o = {
		style : {
			backgroundColor : '#aaa',
			fontFamily : 'Verdana'
		},
		content : [{
			component : 'three/paragraph',
			params : {
				words : [{
					component : 'three/span',
					params : {
						text : "hello" 
					},
					style : {
						color:'red'
					}
				},{
					component : 'three/span',
					params : {
						text : "&nbsp;" 
					}
				},{
					component : 'three/span',
					params : {
						text : "world" 
					}
				}]
			}
		},{
			tag : 'h1',
			text : 'hello'
		},{
			tag : 'h2',
			text : 'world'
		}]
	};

	/*
	o = {
		component : 'three/paragraph',
		params : {
			words : [{
				component : 'three/span',
				params : {
					text : "hello" 
				},
				style : {
					color:'red'
				}
			},{
				component : 'three/span',
				params : {
					text : "&nbsp;" 
				}
			},{
				component : 'three/span',
				params : {
					text : "world" 
				}
			}]
		}
	}
	*/

	FG.lang = 'en';
	FG.io.getJson('/source/i18n/' + FG.lang + '.json', function (lang) {
        FG.i18n.load(lang);
        FG.engy3.render(o,true).then(function (p, r) {
			console.debug(r[0]);
		});
    });
	
})();


/*========================================*
 * 	solve(){
 * 		cerco UN component dall'esterno
 *   	se trovo
 * 		 	rimpiazzo passandogli i params
 * 		 	solve()
 *    	return 
 *  }
 *========================================*/