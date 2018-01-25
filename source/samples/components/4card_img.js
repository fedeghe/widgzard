SM = {
	tag : 'div',
	data : {
		width : '#PARAM{w}',
		height : '#PARAM{h}',
		index : '#PARAM{index}',
		url : '#PARAM{url}',
		id : '#PARAM{id}',
		percWidth : 0.2
	},
	attrs : {
		'class' : 'unselect'
	},
	content : [{
		tag : 'img',
		attrs : {
			src : '#PARAM{src}',
			'class' : 'unselect',
			'data-id' : '#PARAM{index}'
		},
		cb : function () {
			var self = this,
				$elf = self.node;
				pdata = self.parent.data,
				index = parseInt(self.parent.data.index, 10);

			// BASE.css.style($elf, {
			// 	'width' : pdata.width + 'px !important',
			// 	'height' : pdata.height + 'px !important'	
			// });
			$elf.setAttribute('style', 'width:'+ pdata.width + 'px !important; height:'+pdata.height + 'px !important');

			$elf.width = pdata.width;

			$elf.height = pdata.height;

			Wid.events.on($elf, 'click', function (e) {
				Wid.Channel(pdata.id).pub('clicked', [e, parseInt($elf.getAttribute('data-id'), 10)]);
			});
			Wid.events.on($elf, 'load', function(){
				self.done();
			});
		}	
	},{
		tag : 'div',
		html  : '&#10096;',
		attrs : {
			'class' : 'arr unselect'
		},
		cb : function () {
			var self = this,
				$elf = self.node,
				pdata = self.parent.data,
				fsize = ~~(pdata.height * 0.1);

			BASE.css.style($elf, {
				fontSize : fsize + 'px',
				width : (~~(pdata.width) * pdata.percWidth) + 'px',
				height : pdata.height * 0.8 + 'px',
				lineHeight : pdata.height * 0.8 + 'px',
				top : pdata.height * 0.1 + 'px',
				left : '0px'
			});

			Wid.Channel(pdata.id).sub('clicked_left', function (){$elf.style.color = 'white';});
			Wid.Channel(pdata.id).sub('out_left', function (){$elf.style.color = 'transparent';});
			Wid.events.on($elf, 'mouseover', function () {$elf.style.color = 'white';});
			Wid.events.on($elf, 'mouseleave', function () {Wid.Channel(pdata.id).pub('out_left');});
			Wid.events.on($elf, 'click', function (e) {Wid.Channel(pdata.id).pub('clicked_left');});

			self.done();
		}
	},{
		tag : 'div',
		html  : '&#10097;',
		attrs : {
			'class' : 'arr unselect'
		},
		cb : function () {
			var self = this,
				$elf = self.node,
				pdata = self.parent.data,
				fsize = ~~(pdata.height * 0.1);

			BASE.css.style($elf, {
				fontSize : fsize + 'px',
				width : (~~(pdata.width) * pdata.percWidth) + 'px',
				height : pdata.height * 0.8 + 'px',
				lineHeight : pdata.height * 0.8 + 'px',
				top : pdata.height * 0.1 + 'px',
				right : '0px'
			});

			Wid.Channel(pdata.id).sub('clicked_right', function (){$elf.style.color = 'white';});
			Wid.Channel(pdata.id).sub('out_right', function (){$elf.style.color = 'transparent';});
			Wid.events.on($elf, 'mouseover', function () {$elf.style.color = 'white';});
			Wid.events.on($elf, 'mouseleave', function () {Wid.Channel(pdata.id).pub('out_right');});
			Wid.events.on($elf, 'click', function (e) {Wid.Channel(pdata.id).pub('clicked_right');});

			self.done();
		}
	}],
	init : function () {
		var self = this,
			$elf = self.node;
			data = self.data;
		$elf.className = "flip-card-side-" + data.index;
		return true;
	}
}