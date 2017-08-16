var t = {
	tag : 'h2',
	html : "#PARAM{html}",
<<<<<<< HEAD
	data : {
		times : 0
	},
=======
>>>>>>> development
	cb : function () {
		var self = this,
			$elf = self.node;
		$NS$.events.on($elf, 'click', function () {
<<<<<<< HEAD
			var times = ++self.data.times;
			$elf.innerHTML = 'clicked ' + times + " time" + (times == 1 ? "" : "s");
=======
			alert('clicked')
>>>>>>> development
		});
		this.done();
	}
};