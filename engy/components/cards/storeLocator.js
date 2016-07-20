XXX = {
    tag: "li",
    style : {
        backgroundColor : "#PARAM{bgcolor|white}",
        height: "inherit",
        width:"100px"
    },
    attrs : {'class':'round8'},
    data: {
    	places : "#PARAM{places}",
    	options : {
    		localize : "#PARAM{localize}"
    	}
    },
    content : [{
/*
<div id="outDIV" style="position:fixed; top:0">
  <div id="inDIV" style="width:100%; height:100%">
    [map content goes here]
  </div>
</div>
*/
    	style:{
    		width:'100%',
    		height:'inherit',
    		position:'relative'
    	},

    	content : [{
    		style:{
    			width : '100%',
    			height:'100%',

    			position:'absolute',
    			top:'0px',
    			bottom:'0px',
    			padding : '5px'
    		},
    		content :[{
				wid : 'map',
				style : {
					border:'1px solid #aaa'
				},
				cb : function () {
					var self = this,
						mapScr = document.createElement('script');
					//debugger;
					mapScr.onload = function () {
						self.done();
					};
					mapScr.src = "https://maps.googleapis.com/maps/api/js?v=3.exp&callback=initialize";
					document.body.appendChild(mapScr);
					self.node.style.height = '100%';
					self.node.style.width = '100%';//self.climb(4).data.w;
				}
			}]
    	}]
    }],
    cb : function () {

		var self = this,
			map,
			mapNode = self.getNode('map').node;

		window.initialize = function () {
			var mapOptions = {
				zoom: 11,
				center: new google.maps.LatLng(-34.397, 150.644)
		  	};
		  	map = new google.maps.Map(mapNode, mapOptions);
		};


		/*
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {

				var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
					infowindow = new google.maps.InfoWindow({
						map: map,
						position: pos,
						content: 'Location found using HTML5.'
					});

				map.setCenter(pos);
			}, function() {
				handleNoGeolocation(true);
			});
		} else {
			handleNoGeolocation(false);
		}
		function handleNoGeolocation(errorFlag) {
			var content;
			if (errorFlag) {
				var content = 'Error: The Geolocation service failed.';
			} else {
				var content = 'Error: Your browser doesn\'t support geolocation.';
			}

			var options = {
					map: map,
					position: new google.maps.LatLng(60, 105),
					content: content
				},
				infowindow = new google.maps.InfoWindow(options);

			map.setCenter(options.position);
		}
		*/
		self.done();
    }
}