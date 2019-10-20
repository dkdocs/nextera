window.map = L.map('map-container', {
	center: [-22.937913, -43.285081], 
	zoom: 14
})

async function setupMap(wms_layer){

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

	window.wms = load_wms_layer(wms_layer)


	var baseMaps = {
		"streets": streets,
		"satellite": satellite,
		"wms": wms
	};

	streets.addTo(map)
	satellite.addTo(map)

	window.control = L.control.layers(baseMaps);
	control.addTo(map);
}

function init_map(){
	try {
		
		setupMap('mosaic_rio_colored')
		load_towers("data/rio_towers.kml")
		load_lines("data/rio_paths.kml")
	} catch(err) {
		console.error(err);
	}
}

init_map()



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

$(document).ready(function () {
	$("select#city").change(function(){
		var selected_city = $(this).children("option:selected").val();
		clear_map()
		setupMap(DATA_MAPPING[selected_city].wms_layer)
		console.log(DATA_MAPPING[selected_city])
		load_towers(DATA_MAPPING[selected_city].towers_path);
		load_lines(DATA_MAPPING[selected_city].lines_path);
		center = DATA_MAPPING[selected_city].center
		map.panTo(new L.LatLng(center[0], center[1]));
    });
})

function clear_map(){
	map.eachLayer(function (layer) {
		map.removeLayer(layer);
	});
	map.removeControl(control)
}


const WMS_CONFIG = Object.freeze({
	rio: {
		url: 'http://13.229.218.89:8080/geoserver/cite/wms?service=WMS&version=1.1.0&request=GetMap',
		layers: 'mosaic_rio_colored',
		center: [-22.937913, -43.285081]
	},
	mumbai: {
		url: 'http://13.229.218.89:8080/geoserver/cite/wms?service=WMS&version=1.1.0&request=GetMap',
		layers: 'mumbai_pyramid',
		center: [19.038793, 72.870426]
	},
	khartoum: {
		url: 'http://13.229.218.89:8080/geoserver/cite/wms?service=WMS&version=1.1.0&request=GetMap',
		layers: 'khartoum',
		center: [19.038793, 72.870426]
	},
});

const DATA_MAPPING = ['rio', 'mumbai', 'khartoum'].reduce((mapping, name) => {
	mapping[name] = {
		towers_path: `data/${name}_towers.kml`,
		lines_path: `data/${name}_paths.kml`,
		center: WMS_CONFIG[name].center,
		wms_server: WMS_CONFIG[name].url,
		wms_layer: WMS_CONFIG[name].layers
	};

	return mapping;
}, {});


function load_towers(data_path) {
	setTimeout(async () => {
		window.hv_towers = await load_kml(data_path)
		console.log({ hv_towers });
		addLayerHandler('hv_towers', hv_towers);
	}, 0);
}

async function load_kml(data_path) {
	var response = await fetch(data_path);
	var kmlText = await response.text();
	var parser = new DOMParser();
	var kml = parser.parseFromString(kmlText, 'text/xml');
	return new L.KML(kml);
}

function load_lines(data_path) {
	setTimeout(async () => {
		window.transmission_lines = await load_kml(data_path)
		console.log({ transmission_lines });
		addLayerHandler('transmission_lines', transmission_lines);
	}, 0);
}


function addLayerHandler(layerId, layerData) {
	$(`#${layerId}`).unbind('click')
	$(`#${layerId}`).click((event) => {
		event.preventDefault();
		if(map.hasLayer(layerData)){
			$(this).removeClass('selected');
			remove_layer(layerData);
		}else{
			add_layer(layerData)
			$(this).addClass('selected');
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


var popup = L.popup();

function onMapClick(e) {
	popup
		.setLatLng(e.latlng)
		.setContent("You clicked the map at " + e.latlng.toString())
		.openOn(map);
}

map.on('click', onMapClick);


function load_wms_layer(layer){
	var wms_layer =  L.tileLayer.wms("http://13.229.218.89:8080/geoserver/cite/wms?service=WMS&version=1.1.0&request=GetMap", {
		layers: layer,
		format: 'image/png',
		transparent: false,
		attribution: 'Deficit Defiers',
		version: '1.1.0',
		crs:  L.CRS.EPSG4326,
		tms: true
		
	});
	return wms_layer
}




