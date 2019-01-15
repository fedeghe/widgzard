SM = {
	// tag : 'div',
	data : {
		width : '#PARAM{w}',
		height : '#PARAM{h}',
		index : '#PARAM{index}',
		url : '#PARAM{url}',
		carouselId: '#PARAM{carouselId}',
		showTime: '#PARAM{showTime}'
	},
	attrs : {
		'class' : 'unselect'
	},
	content : [{
		tag : 'img',
		attrs : {
			src : '#PARAM{src}',
			'class' : 'unselect',
			'data-id': '#PARAM{mediaIndex}'
		},
		method_resize: function () {
			var n = this.node;
			n.style.width = '30px';
		},
		cb : function () {
			var self = this,
				$elf = self.node,	
				pdata = self.parent.data,
				styles = {
					width: pdata.width + 'px !important',
					height: pdata.height + 'px !important'
				};

			pdata.url && (styles.cursor = 'pointer');
			Widgzard.css.style($elf, styles);

			$elf.width = pdata.width;
			$elf.height = pdata.height;

			Widgzard.events.on($elf, 'click', function (e) {
				Widgzard.Channel(pdata.carouselId).pub('clicked', [e, parseInt($elf.getAttribute('data-id'), 10)]);
			});

			Widgzard.events.on($elf, 'load', function(){
				self.done();
			});

			Widgzard.Channel(pdata.carouselId).sub('updateMedia', function (topic, index, mediaIndex, media) {
				if (index === ~~pdata.index) {
					$elf.src = media;
					$elf.dataset.id = mediaIndex;
				}
			});
		}	
	},{
		component: '4card_img_comment',
		params: { description: '#PARAM{description}' },
		data: { description: '#PARAM{description}' },
		willRender: function () {
			return this.data.description;
		}
	},{
		component: '4card_arrow',
		params: { versus: 'left' }
	},{
		component: '4card_arrow',
		params: { versus: 'right' }
	}],
	init : function () {
		this.node.className = "flip-card-side flip-card-side-" + this.data.index;
		return true;
	},
	cb : function() {
		this.done();
	}
}