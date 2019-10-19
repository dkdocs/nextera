async function setupMap (map) {

	var attribution = 'Deficit Defiers';
	var mapbox_url = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}';
	var access_token = 'sk.eyJ1IjoiZGtkb2NzIiwiYSI6ImNrMXdnZ3puNjAxZ2EzY3FlNjJ6eG9tb2oifQ.7sAvZ1SUl-GlL3ppujkHTg';

	var streets = L.tileLayer(mapbox_url, {
		attribution: attribution,
		// maxZoom: 18,
		id: 'mapbox.streets',
		accessToken: access_token
	});

	var satellite = L.tileLayer(mapbox_url, {
		attribution: attribution,
		// maxZoom: 18,
		id: 'mapbox.satellite',
		accessToken: access_token
	});

	var wms = L.tileLayer.wms("http://13.229.218.89:8080/geoserver/cite/wms?service=WMS&version=1.1.0&request=GetMap", {
		layers: 'mosaic_rio_colored',
		format: 'image/png',
		transparent: false,
		attribution: attribution,
		version: '1.1.0',
		crs:  L.CRS.EPSG4326,
		tms: true
		
	});




	// var map = L.map('map-container', {
	// 	layers: [streets, satellite],
	// 	center: [-22.911441, -43.210902], 
	// 	zoom: 13
	// })


	// var popup = L.popup();

	// function onMapClick(e) {
	// 	popup
	// 		.setLatLng(e.latlng)
	// 		.setContent("You clicked the map at " + e.latlng.toString())
	// 		.openOn(map);
	// }

	// map.on('click', onMapClick);



	// var littleton = L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.'),
	// 	denver    = L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.'),
	// 	aurora    = L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.'),
	// 	golden    = L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.');
		
	// var cities = L.layerGroup([littleton, denver, aurora, golden]);


	var baseMaps = {
		"streets": streets,
		"satellite": satellite,
		"wms": wms
	};

	// var overlayMaps = {
	//     "Cities": cities
	// };


	// L.control.layers(baseMaps).addTo(map);
	try {
		jQuery.getJSON("data/hv_towers_geo_json.geojson", function(data){
			const hv_towers = L.geoJSON(data, {
				coordsToLatLng: function(coordinates){
					return L.latLng(coordinates[0], coordinates[1])
				},
				onEachFeature: function (feature, layer) {
					layer.bindPopup(feature.properties.name);
				}
			})
			// console.log({ hv_towers });
			addLayerHandler('hv_towers', hv_towers);
		});
		
		setTimeout(async () => {
			const response = await fetch("data/rio_paths.kml");
			const kmlText = await response.text();
			const parser = new DOMParser();
			const kml = parser.parseFromString(kmlText, 'text/xml');
	
			const transmission_lines = new L.KML(kml);
			console.log({ transmission_lines });
			addLayerHandler('transmission_lines', transmission_lines);
		}, 0);
	} catch(err) {
		console.error(err);
	}

	function addLayerHandler(layerId, layerData) {
		$(`#${layerId}`).click(() => {
			if(map.hasLayer(layerData)){
				remove_layer(layerData);
			}else{
				add_layer(layerData)
			}
		})
	}

	function add_layer(layer){
		console.log('adding layer', layer, 'to map', map);
		layer.addTo(map)
	}

	function remove_layer(layer){
		console.log('removing layer', layer, 'from map', map);
		map.removeLayer(layer)
	}

	$(document).ready(function () {
		$('.sidebar-links').click(function () {
			let $this = this;
			console.log({ $this });
			if ($(this).hasClass('active')) {
				$(this).removeClass('active')
			} else {
				$(this).addClass('active')
			}
		});
	})
}