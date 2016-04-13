(function () {
	var o = {
		target : document.getElementById('target2'),
		content : [{
			tag : 'iframe',
			attrs : {
				width : '640',
				height:'360',
				srcdoc : '<!DOCTYPE html>'
			},
			style : {
				border : '1px solid red',
				width : '640px',
				height:'360px'
			},
			content : [{
				tag : 'html',
				content : [{
					tag : 'head'
				},{
					tag : 'body',
					
					content : [{
						tag : 'p',
						text : 'hello'
					}]
					
				}]
			}]
		}]
	};

	FG.engy2.render(o, true);
})();