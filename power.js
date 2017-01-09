var colors = {
	"#ccc": ["none"],
	"#444": ["unknown"],
	"#75fff3": ["HVDC"],
	"#d07b87": ["1000000"],
	"#882e72": ["800000"],
	"#c640d9": ["765000", "750000"],
	"#d659b7": ["735000", "660000"],
	"#563389": ["525000", "500000", "450000"],
	"#a1a442": ["440000", "420000", "400000"],
	"#cb87a1": ["380000", "360000", "350000"],
	"#c23e61": ["345000", "330000", "315000", "300000"],
	"#e8601c": ["287000", "275000"],
	"#f1932d": ["240000", "230000", "225000"],
	"#cd4938": ["220000", "187000", "170000"],
	"#1965b0": ["161000", "154000", "150000", "144000", "138000", "132000", "130000"],
	"#7bafde": ["125000", "120000", "115000", "113000", "110000", "100000", "90000", "77000"],
	"#4eb265": ["72000", "70000", "69000", "66000", "65000", "63000"],
	"#818e38": ["60000", "55000", "50000", "46000"],
	"#7e492d": ["35000", "34500", "33000", "22000", "20000"],
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
	'150000;60000',
	'138000;69000',
	'132000;66000',
	'132000;55000',
	'132000;50000',
	'115000;69000',
	'115000;34500',
	'110000;20000',
	'66000;22000'
];

function labels() {
	map.addLayer({
		"id": "powerline label",
		"type": "symbol",
		"source": "power",
		"source-layer": "power",
		"filter": [
			"all",
			["in", "kind", "powerline", "power_cable"],
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
			"text-halo-color": "#fff",
			"text-color": "hsl(0, 1%, 34%)",
			"text-halo-width": {
				 "base": 1,
				 "stops": [[14,1.25],[15,1.5]]
			},
			"text-halo-blur": 0,
			"text-translate": [0,-2]
		}
	});
	map.addLayer({
		"id": "generator label",
		"type": "symbol",
		"source": "power",
		"source-layer": "power",
		"filter": [
			"all",
			["==", "kind", "generator"],
		],
		"minzoom": 16,
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
			"text-field": "{name} {generator:output:electricity}",
			"text-letter-spacing": 0.1,
			"text-max-width": 7
		},
		"paint": {
			"text-halo-color": "#fff",
			"text-color": "hsl(0, 1%, 34%)",
			"text-halo-width": {
				 "base": 1,
				 "stops": [[14,1.25],[15,1.5]]
			},
			"text-halo-blur": 0,
			"text-translate": [0,-2]
		}
	});
	map.addLayer({
		"id": "substation label",
		"type": "symbol",
		"source": "power",
		"source-layer": "power",
		"filter": [
			"all",
			["in", "kind", "substation"],
			["==", "label_placement", true],
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
			"text-halo-color": "#fff",
			"text-color": "hsl(0, 1%, 34%)",
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
			["==", "label_placement", true],
		],
		"layout": {
			"text-line-height": 1,
			"text-size": {
				"base": 1,
				"stops": [[6,11],[16,16]]
			},
			"text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
			"symbol-placement": "point",
			"text-padding": 3,
			"text-field": "{name}",
			"text-letter-spacing": 0.1,
			"text-max-width": 7
		},
		"paint": {
			"text-halo-color": "#fff",
			"text-color": "hsl(0, 1%, 34%)",
			"text-halo-width": {
				 "base": 1,
				 "stops": [[14,1.25],[15,1.5]]
			},
			"text-halo-blur": 0,
			"text-translate": [0,-2]
		},
		"minzoom": 6
	});
}

function ercot_rtm() {
	map.addSource('ercot_rtm', {
		'type': 'geojson',
		'data': 'ercot_rtm.geojson'
	});
	map.addLayer({
		"id": "ercot_rtm",
		"type": "circle",
		"source": "ercot_rtm",
		"paint": {
			'circle-color': '#555',
			'circle-radius': {
				"stops": [[5, 0], [6, 8]]
			},
		}
	});
	map.on('click', function (e) {
		var features = map.queryRenderedFeatures(e.point, { layers: ['ercot_rtm'] });

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
}

function set_ercot_rtm(visible) {
	if (!map.getSource('ercot_rtm'))
		ercot_rtm();
	map.setPaintProperty('ercot_rtm', 'circle-opacity', visible ? 1 : 0);
}

function ercot_boundary() {
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
			"line-opacity": 0
		}
	},"otherline_primary");
}

function set_ercot_boundary(visible) {
	if (!map.getSource('ercot_bound'))
		ercot_boundary();
	map.setPaintProperty('ercot_bound', 'line-opacity', visible ? 1 : 0);
}

function powerline_group(pfx, base) {
	var cable_base = JSON.parse(JSON.stringify(base));
	cable_base.filter.push(["==", "kind", "power_cable"]);
	cable_base.paint['line-dasharray'] = [2, 2];

	var cable_novoltage = JSON.parse(JSON.stringify(cable_base));
	cable_novoltage.filter.push(["!has", "voltage"]);
	cable_novoltage.id = pfx + "cable no voltage";
	cable_novoltage.paint['line-color'] = voltage_colors.none;
	cable_novoltage.minzoom = 9;
	map.addLayer(cable_novoltage, "powerline label");

	var cable = JSON.parse(JSON.stringify(cable_base));
	cable.id = pfx + "power cable";
	cable.filter = cable.filter.concat([
		["has", "voltage"],
		["!=", "frequency", "0"],
	]);
	var max_stops = [];
	max_stops.push([0, voltage_colors.unknown])
	for (var e in voltage_colors) {
		var n = Number(e);
		if (n == NaN) continue;
		max_stops.push([n, voltage_colors[e]]);
	}
	cable.paint["line-color"] = {
		"property": "max_voltage",
		"type": "categorical",
		"stops": max_stops
	}
	map.addLayer(cable, "powerline label");

	var cable_hvdc = JSON.parse(JSON.stringify(cable_base));
	cable_hvdc.id = pfx + "cable_hvdc";
	cable_hvdc.filter = cable_hvdc.filter.concat([
		["has", "voltage"],
		["==", "frequency", "0"],
	]);
	cable_hvdc.paint["line-color"] = voltage_colors.HVDC;
	map.addLayer(cable_hvdc, "powerline label");

	base.filter.push(["==", "kind", "powerline"]);

	var novoltage = JSON.parse(JSON.stringify(base));
	novoltage.filter.push(["!has", "voltage"]);
	novoltage.id = pfx + "line_no_voltage";
	novoltage.paint['line-color'] = voltage_colors.none;
	novoltage.minzoom = 9;
	map.addLayer(novoltage, "powerline label");

	var primary = JSON.parse(JSON.stringify(base));
	primary.filter.push(["in", "voltage"].concat(voltage_combos));
	primary.paint["line-color"] = {
		"property": "voltage",
		"type": "categorical"
	}
	var secondary = JSON.parse(JSON.stringify(primary));
	var primary_stops = [['unknown', voltage_colors.unknown]];
	var secondary_stops = [['unknown', voltage_colors.unknown]];
	for (var i = 0; i < voltage_combos.length; ++i) {
		var voltages = voltage_combos[i].split(';');
		if (!voltage_colors.hasOwnProperty(voltages[0])) console.log('missing', voltages[0]);
		if (!voltage_colors.hasOwnProperty(voltages[1])) console.log('missing', voltages[1]);
		primary_stops.push([voltage_combos[i], voltage_colors[voltages[0]]]);
		secondary_stops.push([voltage_combos[i], voltage_colors[voltages[1]]]);
	}
	primary.id = pfx + 'powerline primary';
	primary.paint['line-color'].stops = primary_stops;
	primary.paint['line-dasharray'] = [2, 2];
	secondary.id = pfx + 'powerline secondary';
	secondary.paint['line-color'].stops = secondary_stops;
	secondary.paint['line-dasharray'] = [0, 2, 2];
	map.addLayer(primary, "powerline label");
	map.addLayer(secondary, "powerline label");

	var line = JSON.parse(JSON.stringify(base));
	line.id = pfx + "power line";
	line.filter = line.filter.concat([
		["has", "voltage"],
		["!in", "voltage"].concat(voltage_combos),
		["!=", "frequency", "0"],
	]);
	var stops = [];
	stops.push(['unknown', voltage_colors.unknown])
	for (var e in voltage_colors) {
		var n = Number(e);
		if (n == NaN) continue;
		stops.push([e, voltage_colors[e]]);
		stops.push([e + ';0', voltage_colors[e]]);
	}
	line.paint["line-color"] = {
		"property": "voltage",
		"type": "categorical",
		"stops": stops
	}
	map.addLayer(line, "powerline label");

	var hvdc = JSON.parse(JSON.stringify(base));
	hvdc.id = pfx + "hvdc";
	hvdc.filter = hvdc.filter.concat([
		["has", "voltage"],
		["==", "frequency", "0"],
	]);
	hvdc.paint["line-color"] = voltage_colors['HVDC']
	map.addLayer(hvdc, "powerline label");
}

function powerlines() {
	var base = {
		"type": "line",
		"source": "power",
		"source-layer": "power",
		"filter": [
			"all",
			["!=", "grid", "ercot"],
		],
		"layout": {
			"line-join": "miter"
		},
		"paint": {
			"line-width": 2.5,
		}
	}
	powerline_group('otherline_', base);

	base = {
		"type": "line",
		"source": "power",
		"source-layer": "power",
		"filter": [
			"all",
			["==", "grid", "ercot"],
		],
		"layout": {
			"line-join": "miter"
		},
		"paint": {
			"line-width": 2.5
		}
	}
	powerline_group('ercotline_', base);
}

function power_areas() {
	map.addLayer({
		"id": "power area",
		"type": "line",
		"source": "power",
		"source-layer": "power",
		"filter": [
			"all",
			["in", "kind", "substation", "plant"],
			["!=", "label_placement", true],
		],
		"minzoom": 10,
		"paint": {
			"line-color": "hsl(0, 1%, 34%)",
			"line-width": 1
		}
	});
	map.addLayer({
		"id": "generator point",
		"source": "power",
		"source-layer": "power",
		"filter": [
			"all",
			["==", "kind", "generator"],
			["==", "$type", "Point"],
		],
		"type": "circle",
		"paint": {
			'circle-color': 'hsl(0, 100%, 71%)',
			'circle-stroke-color': 'hsl(0, 100%, 32%)',
			'circle-stroke-width': {
				"stops": [[5, 0], [7, 0.5], [12, 3]]
			},
			'circle-radius': {
				"stops": [[5, 0], [7, 0.5], [12, 4]]
			},
		}
	});
	map.addLayer({
		"id": "generator polygon",
		"source": "power",
		"source-layer": "power",
		"filter": [
			"all",
			["==", "kind", "generator"],
			["==", "$type", "Polygon"],
		],
		"type": "fill",
		"paint": {
			'fill-color': 'hsl(0, 100%, 71%)',
			'fill-outline-color': 'hsl(0, 100%, 32%)',
		}
	});
}

function set_ercot_highlight(highlight) {
	var opacity = highlight ? 0.33 : 1;
	for (var layer in map.style._layers) {
		if (layer.startsWith('otherline_')) {
			map.setPaintProperty(layer, 'line-opacity', opacity);
		}
	}
}

function style_init() {
	map.addSource('power', {
		type: 'vector',
		tiles: ["https://nhts.kreed.org/vt/all/{z}/{x}/{y}.mvt"],
		minzoom: 0,
		maxzoom: 16
	});

	power_areas();
	labels();
	powerlines();
}
