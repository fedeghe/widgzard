SM = {
	tag : 'div',
	style : {
		backgroundColor : 'red',
		padding:'10px'
	},
	html : "#PARAM{a}",
	content : [{
		component : 'test/sub/a',
		params : {
			name :'fede'
		},
		style : {
			backgroundColor : 'violet',
			padding:'10px'
		}
	},{
		component : 'test/sub/b',
		params : {
			name :'rico'
		},
		style : {
			padding:'10px'
		},
		data : {
			arr : "#PARAM{arr}",
			doList : "#PARAM{doList}"
		},
		cb : function () {
			var self = this;
			
			if (self.data.doList){
				
				console.debug('base.js component ', self.data.arr);
			}
			self.done();
		}
	},{
		style : {
			color:'white',
			backgroundColor:'green',
			padding:'10px'
		},
		html : 'hello crazy'
	},{
		html : "#PARAM{one.two.three.four.five.six.seven.eight.nine}"
	}]
}