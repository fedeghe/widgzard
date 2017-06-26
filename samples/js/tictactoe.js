(function () {

	FG.engy.components({
		'square': {
			tag : 'button',
			attrs : {"class" : "square"},
			data : {
				value : null
			},

			cb : function () {
				var self = this,
					$elf = self.node;
				FG.events.on($elf, 'click', function () {
					console.log(self.root)
					// self.data.value = self.root.data.step++ % 2 ? 'x' : 'o';
					$elf.innerHTML = 'X'; //self.data.value;
					
				})
				self.done();
			}	
		},
		'board': {

			content : [{
				attrs : {"class" : "status"},
				html : "Next player  : X"
			},{
				tag : 'textarea',
				wid : 'tx1',
				html : "2wdb(parent.data.prova)"
			},{
				tag : 'textarea',
				html : "2wdb(parent.data.prova)"
			},{
				tag : 'p',
				html : "2wdb(parent.data.prova)"
			}],
			data : {
				prova : 'no data',
				createRow : function () {
					return [
						{component : 'square'},
						{component : 'square'},
						{component : 'square'}
					];
				}
			},
			cb : function () {
				var self = this,
					rows = {
						target : self.node,

						content : [{
							attrs : {"class" : "board-row"},
							content : self.data.createRow()
						},{
							attrs : {"class" : "board-row"},
							content : self.data.createRow()
						},{
							attrs : {"class" : "board-row"},
							content : self.data.createRow()
						}]
					};
				FG.engy.render(rows)
				self.done();
			}
		},
		'game': {
			content : [{

				component : 'board',
				attrs : {"class" : "game-board"}
			},{
				attrs : {"class" : "game-info"},
				content : [{
					tag : 'div'
				}, {
					tag : 'ol'
				}]
			}]
		}
	});

	var o = {
		/**
		 * YEAH NOW HERE
		 */
		target : document.getElementById('container'),
		
		content : [{
			data : {step : 0},
			component : "game"
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