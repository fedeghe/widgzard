SM = {
	tag : 'div',
	attrs : {
		"class" : "flip-card"
	},
	data : {
		card : '#PARAM{card_component}',
		srcs : '#PARAM{data}',
		videos : '#PARAM{videos}',
		controls : '#PARAM{controls}',
		urls : '#PARAM{urls}',
		width : '#PARAM{width}',
		height : '#PARAM{height}',
		rWidth : '#PARAM{rWidth}',
		rHeight : '#PARAM{rHeight}',
		showTime : '#PARAM{showTime}',
		transitionTime : '#PARAM{transitionTime}',
		zoomEffect : '#PARAM{zoomEffect}',
		id : '#PARAM{id}',
		invertedControl: '#PARAM{invertedControl}'
	},
	init : function () {
		var self = this,
			$elf = self.node,
			data = self.data;

		data.count = data.srcs.length || data.videos.length

		data.calc = function () {
			var a1 = Math.atan(2/10),
			    a2 = Math.atan(2/9),
			    l = 1000/Math.cos(a2),
			    d = l*Math.sin(a2);
			return d;
		}

		$elf.style.width = data.rWidth + 'px';
		$elf.style.height = data.rHeight + 'px';
		return true;
	},
	content : [{
		attrs: {
			"class" : "flip-card-content"
		},
		init : function () {
			var self = this,
				$elf = self.node,
				data = self.parent.data,
				i = 0, l = data.count;

			$elf.style.width = data.width + 'px';
			$elf.style.height = data.height + 'px';
			data.stage = {
				target : $elf,
				content : []
			};

			for (null; i < l; i++) {
				(function (j) {
					data.stage.content.push({
						component : data.card,
						params : {
							index : "" + j,
							url : data.urls[j],
							src : data.srcs[j] || null,
							videos : data.videos[j] || null,
							controls : data.controls,
							w : data.width,
							h : data.height,
							id : data.id,
							showTime : data.showTime,
							transitionTime : data.transitionTime,
						}
					});
				})(i);
			}
			return true;
		},
		cb : function () {
			var self = this,
				$elf = self.node,
				data = self.parent.data,
				step = 90,
				current = 0,
				interval,
				versus = 1,
				cnt = Wid.Engy.render(data.stage),
				mobTo,
				sign = self.parent.data.invertedControl ? -1 : 1;
		
			function start () {
				interval = window.setInterval(forward, data.showTime);
			}

			function mod04 (i) {
				while (i < 0) i += 4;
				return i%4;
			}
			function forward () {
				versus = sign;
				lets();
			}
			function backward() {
				versus = -sign;
				lets();
			}
			function lets () {
				current += versus;
				go();
			}

			function doArrow(e) {
				switch (e.keyCode) {
					case 39 : forward(); break;
					case 37 : backward(); break;
				}
			}

			function enableArrows() {
				Wid.events.on(window, 'keyup', doArrow);
			}
			
			function disableArrows() {
				Wid.events.off(window, 'keyup', doArrow);
			}
			
			function go() {
				var tmp = -step * current,
					index = mod04(current);
				Wid.Channel(data.id).pub('move_to', [index]);
				BASE.css.style($elf, {
	                'transform' : 'scale(' + data.zoomEffect + ') rotateY(' + (tmp + versus * step / 2) + 'deg)',
	                '-o-transform' : 'scale (' + data.zoomEffect + ') rotatey(' + (tmp + versus * step / 2) + 'deg)',
	                '-webkit-transform' : 'scale (' + data.zoomEffect + ') rotateY(' + (tmp + versus * step / 2) + 'deg)',
					'-ms-transform' : 'scale (' + data.zoomEffect + ') rotateY(' + (tmp + versus * step / 2) + 'deg)'
	            });
	            window.setTimeout(function () {
	            	BASE.css.style($elf, {
		                'transform' : 'scale(1) rotateY(' + tmp + 'deg)',
		                '-o-transform' : 'scale (1) rotatey(' + tmp + 'deg)',
		                '-webkit-transform' : 'scale (1) rotateY(' + tmp + 'deg)',
						'-ms-transform' : 'scale (1) rotateY(' + tmp + 'deg)'
		            });	
	            }, 1000 * data.transitionTime);
			}

			function stop () {
				window.clearInterval(interval);
			}

			Wid.Channel(data.id).sub('clicked', function (topic, e, index) {
				var i = parseInt(index, 10);
				data.urls
				&& i in data.urls
				&& data.urls[i]
				&& window.open(data.urls[i]);
			});

			Wid.Channel(data.id).sub('ended', forward);
			Wid.Channel(data.id).sub('clicked_left', backward);
			Wid.Channel(data.id).sub('clicked_right', forward);
			Wid.Channel(data.id).pub('move_to', [0]);


			switch (data.card) {
				case '4card_video': break;
				case '4card_img':
					start();
					if (BASE.utils.isMobile){
						Wid.events.on($elf, 'click', function () {
							stop();
							mobTo && clearTimeout(mobTo);
							mobTo = window.setTimeout(start, 2 * data.showTime);
						});
					} else {
						Wid.events.on($elf, 'mouseenter', stop);
						Wid.events.on($elf, 'mouseleave', start);
					}
				break;
			}
			Wid.events.on($elf, 'mouseenter', enableArrows);
			Wid.events.on($elf, 'mouseleave', disableArrows);
			self.done();
		}
	}]
}
