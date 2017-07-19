var t = {
	tag : 'h2',
	html : "#PARAM{html}",
	data : {
		times : 0
	},
	cb : function () {
		var self = this,
			$elf = self.node;
		$NS$.events.on($elf, 'click', function () {
			var times = ++self.data.times;
			$elf.innerHTML = 'clicked ' + times + " time" + (times == 1 ? "" : "s");
		});
		this.done();
	}
};