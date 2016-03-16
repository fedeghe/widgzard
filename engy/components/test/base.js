{
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
		}
	},{
		style : {
			color:'white',
			backgroundColor:'green',
			padding:'10px'
		},
		html : 'hello crazy'
	}]
}