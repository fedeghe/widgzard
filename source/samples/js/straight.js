(function () {
	var o = {
		target : document.getElementById('target2'),
		content : [{
			tag : 'iframe',
			attrs : {
				width : '640',
				height:'360'
			},
			style : {
				border : '1px solid red',
				width : '640px',
				height:'360px'
			},
			init : function () {
				var self = this,
					$elf = self.node,
					src = "data:text/html;charset=UTF-8,",
					content = FG.Widgzard.get({
						content : [{
							tag : 'p',
							text : 'hello'
						},{
							tag : 'script',
							text : 'alert(parent.location.protocol)'
						}]
					});
				console.log(src + content.innerHTML)
				$elf.src = src + content.innerHTML;
				return true;
			}
		}]
	};

	FG.engy.render(o, true);
})();