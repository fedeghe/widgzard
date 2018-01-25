SM = {
	tag : 'div',
	data : {
		width : '#PARAM{w}',
		height : '#PARAM{h}',
		index : '#PARAM{index}',
		videos : '#PARAM{videos}',
		id : '#PARAM{id}',
		percWidth : 0.2,
		controls : '#PARAM{controls}',
		uid : ""+Wid.utils.uniqueid
	},
	sytyle : {
		position:'relative'
	},
	content : [{
		tag : 'video',
		attrs : {
			// controls:true,
			'data-id' : '#PARAM{index}'
		},
		init : function () {
			var self = this,
				$elf = self.node;
				
			if (self.parent.data.controls){
				$elf.controls = true;
			}
			return true;
		},
		content : [{
			tag: "source",
			attrs: {
				type: "video/mp4"
			},
			cb : function () {
				var self = this,
					$elf = this.node,
					data = self.parent.parent.data,
					videos = data.videos;
				if (!('mp4' in videos)) {
					BASE.dom.remove(this.node);
				} else {	
					this.node.src = videos.mp4;
				}
				this.done();
			}
		},{
			tag: "source",
			attrs: {
				type: "video/webm"
			},
			cb : function () {
				var self = this,
					$elf = this.node,
					data = self.parent.parent.data,
					videos = data.videos;
				if (!('webm' in videos)) {
					BASE.dom.remove(this.node);
				} else {	
					this.node.src = videos.webm;
				}
				this.done();
			}
		},{
			tag: "source",
			attrs: {
				type: "video/ogg"
			},
			cb : function () {
				var self = this,
					$elf = this.node,
					data = self.parent.parent.data,
					videos = data.videos;
				if (!('ogg' in videos)) {
					BASE.dom.remove(this.node);
				} else {	
					this.node.src = videos.ogg;
				}
				this.done();
			}
		}],
		cb : function () {
			var self = this,
				$elf = self.node;
				pdata = self.parent.data,
				index = parseInt(self.parent.data.index, 10);

			// self.lateWid('video' + index);
			// $elf.volume = 0;

			$elf.setAttribute('style', 'width:'+ pdata.width + 'px !important; height:'+pdata.height + 'px !important');

			$elf.width = pdata.width;
			$elf.height = pdata.height;

			Wid.Channel(pdata.id).sub('move_to', function (topic, num) {
				console.debug('goint to : '+ num)
				if (num == self.parent.data.index) {
					$elf.play();
				} else {
					$elf.pause();
				}
			});
			
			if (0 == self.parent.data.index){
				$elf.autoplay = true;
			}
			Wid.events.on($elf, 'ended', function (e) {
				Wid.Channel(pdata.id).pub('ended');
			});

			Wid.events.on($elf, 'click', function (e) {
				Wid.Channel(pdata.id).pub('clicked', [e, parseInt($elf.getAttribute('data-id'), 10)]);
			});
			Wid.events.on($elf, 'canplay', function(){
				if (0 == self.parent.data.index){
					window.setTimeout(function(){$elf.play();}, 100);
				}
			});
			self.done();
		}	
	},{
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
				zIndex : 900,
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
				zIndex : 900,
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