{
	tag : 'p',
	style : {
		color:'white',
		padding:'10px'
	},
	content : [{
		component : 'test/sub/sub/c',
		params : {
			name : "GABRIELE"
		},
		style : {
			color:'red',
			backgroundColor : 'pink',
			padding:'10px'
		}
	}, {
		tag : 'span',
		html : "maremma maiala #PARAM{name|FEDERICO} xxx"	,
		style : {
			padding:'10px'
		}
	}]
}