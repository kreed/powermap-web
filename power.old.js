var colors = [
// HVDC
	"#5b40bf",
// 1000
	"#d07b87",
// 800
	"#882e72",
// 750-765
	"#aa4dbf",
// 660-735
	"#d659b7",
// 450-525
	"#61477a",

// 400-440
	"#4cac8f",
// 350-380
	"#cb87a1",
// 315-345
	/*"#dc050c",*/
	"#c23e61",
// 275-287
	"#e8601c",
// 225-240
	"#f1932d",

// 187-220
	"#cd4938",
// 132-161
	"#1965b0",
// 90-125
	"#7bafde",
// 63-72
	"#4eb265",
// 46-60
	"#818e38",

// 33-34.5
	"#b97344"
];

var voltage_colors = {
	'HVDC': colors.shift(),

	'1000000': colors.shift(),

	'800000': colors.shift(),

	'765000': colors[0],
	'750000': colors.shift(),

	'735000': colors[0],
	'660000': colors.shift(),

	'525000': colors[0],
	'500000': colors[0],
	'450000': colors.shift(),

	'440000': colors[0],
	'420000': colors[0],
	'400000': colors.shift(),

	'380000': colors[0],
	'360000': colors[0],
	'350000': colors.shift(),

	'345000': colors[0],
	'330000': colors[0],
	'315000': colors[0],
	'300000': colors.shift(),

	'287000': colors[0],
	'275000': colors.shift(),

	'240000': colors[0],
	'230000': colors[0],
	'225000': colors.shift(),

	'220000': colors[0],
	'187000': colors.shift(),

	'161000': colors[0],
	'154000': colors[0],
	'150000': colors[0],
	'144000': colors[0],
	'138000': colors[0],
	'132000': colors[0],
	'130000': colors.shift(),

	'125000': colors[0],
	'120000': colors[0],
	'115000': colors[0],
	'113000': colors[0],
	'110000': colors[0],
	'100000': colors[0],
	'90000': colors.shift(),

	'72000': colors[0],
	'70000': colors[0],
	'69000': colors[0],
	'66000': colors[0],
	'65000': colors[0],
	'63000': colors.shift(),

	'60000': colors[0],
	'55000': colors[0],
	'50000': colors[0],
	'46000': colors.shift(),

	'35000': colors[0],
	'34500': colors[0],
	'33000': colors[0],
	'20000': colors.shift()
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
	'230000;34500',
	'230000;138000',
	'230000;115000',
	'230000;69000',
	'220000;150000',
	'220000;132000',
	'220000;115000',
	'220000;110000',
	'220000;66000',
	'150000;70000',
	'138000;69000',
	'132000;66000',
	'132000;55000',
	'115000;69000',
	'110000;20000'
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
