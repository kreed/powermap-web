var colors = {
	"#5b40bf": ["HVDC"],
	"#d07b87": ["1000000"],
	"#882e72": ["800000"],
	"#aa4dbf": ["765000", "750000"],
	"#d659b7": ["735000", "660000"],
	"#61477a": ["525000", "500000", "450000"],
	"#4cac8f": ["440000", "420000", "400000"],
	"#cb87a1": ["380000", "360000", "350000"],
	/*"#dc050c",*/
	"#c23e61": ["345000", "330000", "315000", "300000"],
	"#e8601c": ["287000", "275000"],
	"#f1932d": ["240000", "230000", "225000"],
	"#cd4938": ["220000", "187000"],
	"#1965b0": ["161000", "154000", "150000", "144000", "138000", "132000", "130000"],
	"#7bafde": ["125000", "120000", "115000", "113000", "110000", "100000", "90000", "77000"],
	"#4eb265": ["72000", "70000", "69000", "66000", "65000", "63000"],
	"#818e38": ["60000", "55000", "46000"],
	"#b97344": ["35000", "34500", "33000", "22000", "20000"],
};

var voltage_colors = {};
for (var color in colors) {
	var voltages = colors[color];
	for (var i = 0; i < voltages.length; ++i) {
		voltage_colors[voltages[i]] = color;
	}
}

var voltage_combos = [
	'500000;230000',
	'500000;115000',
	'400000;275000',
	'400000;225000',
	'400000;220000',
	'400000;150000',
	'400000;110000',
	'380000;220000;110000',
	'380000;220000',
	'380000;132000',
	'380000;110000',
	'345000;230000',
	'345000;161000',
	'345000;138000',
	'345000;115000',
	'345000;69000',
	'275000;154000',
	'275000;66000',
	'230000;34500',
	'230000;138000',
	'230000;115000',
	'230000;69000',
	'220000;150000',
	'220000;132000',
	'220000;115000',
	'220000;110000',
	'220000;66000',
	'161000;69000',
	'154000;66000',
	'150000;70000',
	'138000;69000',
	'132000;66000',
	'132000;55000',
	'115000;69000',
	'110000;20000',
	'66000;22000'
];

function esri_imagery() {
	map.addSource('esri', {
		type: 'raster',
		tiles: ["http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
		maxzoom: 18,
		attribution: '&copy; ESRI',
		tileSize: 256
	});
	map.addLayer({
		"id": "esri",
		"type": "raster",
		"source": "esri",
	}, 'mapbox-mapbox-satellite');
	map.removeLayer('mapbox-mapbox-satellite');
}

function ercot() {
	map.addSource('ercot_bound', {
		'type': 'geojson',
		'data': 'ercot_bound.geojson'
	});
	map.addLayer({
		"id": "ercot_bound",
		"type": "line",
		"source": "ercot_bound",
		"paint": {
			"line-color": "#888",
			"line-width": 2,
		}
	},"poi-scalerank2");
}

function labels() {
	map.addLayer({
		"id": "powerline label",
		"type": "symbol",
		"source": "power",
		"source-layer": "power",
		"filter": [
			"all",
			["==", "kind", "powerline"],
			["!=", "usage", "distribution"]
		],
		"minzoom": 10,
		"layout": {
			"text-size": {
				"base": 1,
				"stops": [[9,10], [20, 16]]
			},
			"text-max-angle": 30,
			"symbol-spacing": 100,
			"text-font": [
				"DIN Offc Pro Medium",
				"Arial Unicode MS Regular"
			],
			"symbol-placement": "line",
			"text-padding": 1,
			"text-offset": [0,0],
			"text-rotation-alignment": "map",
			"text-anchor": "bottom",
			"text-field": "{voltage} ({cables})"
		},
		"paint": {
			"text-color": "#fff",
			"text-halo-color": {
				"base": 1,
				"stops": [[8,"hsl(0, 1%, 10%)"],[16,"hsl(0, 2%, 16%)"]]
			},
			"text-halo-width": {
				"base": 1,
				"stops": [[14,1.25],[15,1.5]]
			},
			"text-halo-blur": 0,
			"text-translate": [0,-2]
		}
	});
	map.addLayer({
		"id": "plant label",
		"type": "symbol",
		"source": "power",
		"source-layer": "power",
		"filter": [
			"all",
			["in", "kind", "plant"],
		],
		"minzoom": 4,
		"layout": {
			'icon-image': 'circle-stroked-11',
			'icon-size': {
				"stops": [[5, 0], [6, 1]]
			},
			'icon-allow-overlap': true
		}
	});
	map.addLayer({
		"id": "power label",
		"type": "symbol",
		"source": "power",
		"source-layer": "power",
		"filter": [
			"all",
			["in", "kind", "substation"],
		],
		"minzoom": 10,
		"layout": {
			"text-line-height": 1,
			"text-size": {
				"base": 1,
				"stops": [[12,11],[16,16]]
			},
			"symbol-avoid-edges": true,
			"text-transform": "uppercase",
			"text-font": [
				"DIN Offc Pro Medium",
				"Arial Unicode MS Regular"
			],
			"symbol-placement": "point",
			"text-padding": 3,
			"text-field": "{name}",
			"text-letter-spacing": 0.1,
			"text-max-width": 7
		},
		"paint": {
			"text-halo-color": {
				"base": 1,
				"stops": [[9,"hsl(0, 0%, 18%)"],[16,"hsl(0, 2%, 14%)"]]
			},
			"text-halo-blur": 0.5,
			"text-color": "hsl(35, 100%, 100%)",
			"text-halo-width": 1
		}
	});
}

getDocument = function(url, callback) {
	const xhr = new window.XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'document';
	xhr.onerror = function(e) {
		callback(e);
	};
	xhr.onload = function() {
		if (xhr.response.byteLength === 0 && xhr.status === 200) {
			return callback(new Error('http status 200 returned without content.'));
		}
		if (xhr.status >= 200 && xhr.status < 300 && xhr.response) {
			callback(null, xhr.response);
		} else {
			callback(new Error(xhr.statusText));
		}
	};
	xhr.send();
	return xhr;
};

function generators() {
	return;
	getDocument('ercot_gen.php', function(error, data) {
		var geojson = toGeoJSON.kml(data);
		map.addSource('ercot_gen', {
			'type': 'geojson',
			'data': geojson
		});

		map.addLayer({
			"id": "ercot_gen",
			"type": "symbol",
			"source": "ercot_gen",
			"layout": {
				'icon-image': 'circle-stroked-11',
				'icon-size': {
					"stops": [[5, 0], [6, 1]]
				},
				'icon-allow-overlap': true
			}
		},"poi-scalerank2");

		map.on('click', function (e) {
			var features = map.queryRenderedFeatures(e.point, { layers: ['ercot_gen'] });

			if (!features.length) {
				return;
			}

			var feature = features[0];

			// Populate the popup and set its coordinates
			// based on the feature found.
			var popup = new mapboxgl.Popup()
				.setLngLat(feature.geometry.coordinates)
				.setHTML(feature.properties.description)
				.addTo(map);
		});
	});
}
