var t = {
	tag : 'h2',
	html : "#PARAM{html}",
	cb : function () {
		var self = this,
			$elf = self.node;
		$NS$.events.on($elf, 'click', function () {
			alert('clicked')
		});
		this.done();
	}
};