{
	tag : 'p',
	style : {
		color:'blue',
		padding:'10px'
	},
	html : "#PARAM{name}",
	init : function () {
		console.debug(this.data);
		return true;
	},
	content : [{
		text : 'HEI IO SONO TESTO'
	}]
}