import mapboxgl from 'mapbox-gl'

var colors = {
	"#ccc": ["unknown"],
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

let PowerStyle = class PowerStyle {
	labels() {
		this.map.addLayer({
			"id": "powerline label",
			"type": "symbol",
			"source": "power",
			"source-layer": "power-line",
			"filter": ["in", "kind", "line", "cable"],
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
				"text-field": "{label}"
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
		this.map.addLayer({
			"id": "generator label",
			"type": "symbol",
			"source": "power",
			"source-layer": "power-point",
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
		this.map.addLayer({
			"id": "substation label",
			"type": "symbol",
			"source": "power",
			"source-layer": "power-point",
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
		this.map.addLayer({
			"id": "plant label",
			"type": "symbol",
			"source": "power",
			"source-layer": "power-point",
			"filter": [
				"all",
				["in", "kind", "plant"],
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
				"text-field": "{label}",
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

	ercot_rtm() {
		this.map.addSource('ercot_rtm', {
			'type': 'geojson',
			'data': 'ercot_rtm.geojson'
		});
		this.map.addLayer({
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
		var map = this.map;
		this.map.on('click', function (e) {
			var features = map.queryRenderedFeatures(e.point, { layers: ['ercot_rtm'] });

			if (!features.length) {
				return;
			}

			var feature = features[0];

			// Populate the popup and set its coordinates
			// based on the feature found.
			new mapboxgl.Popup()
				.setLngLat(feature.geometry.coordinates)
				.setHTML(feature.properties.description)
				.addTo(map);
		});
	}

	set_ercot_rtm(visible) {
		if (!this.map.getSource('ercot_rtm'))
			this.ercot_rtm();
		this.map.setPaintProperty('ercot_rtm', 'circle-opacity', visible ? 1 : 0);
	}

	powerline_base(pfx, filter) {
		var lines = [{
			"type": "line",
			"source": "power",
			"source-layer": "power-line",
			"filter": ["all",
				["==", "kind", "cable"],
				["!=", "frequency", "0"]
			],
			"layout": {
				"line-join": "miter"
			},
			"paint": {
				"line-width": {
					"base": 1.5,
					"stops": [
						[8, 1.5],
						[12, 3]
					]
				},
				"line-dasharray": [2, 2]
			},
			"id": "cable"
		}, {
			"type": "line",
			"source": "power",
			"source-layer": "power-line",
			"filter": ["all",
				["==", "kind", "cable"],
				["has", "voltage"],
				["==", "frequency", "0"]
			],
			"layout": {
				"line-join": "miter"
			},
			"paint": {
				"line-width": {
					"base": 1.5,
					"stops": [
						[8, 1.5],
						[12, 3]
					]
				},
				"line-dasharray": [2, 2]
			},
			"id": "cable_hvdc"
		}, {
			"type": "line",
			"source": "power",
			"source-layer": "power-line",
			"filter": ["all",
				["==", "kind", "line"],
				["in", "voltage"].concat(voltage_combos),
			],
			"layout": {
				"line-join": "miter"
			},
			"paint": {
				"line-width": {
					"base": 1.5,
					"stops": [
						[8, 1.5],
						[12, 3]
					]
				},
				"line-dasharray": [2, 2]
			},
			"id": "line_primary"
		}, {
			"type": "line",
			"source": "power",
			"source-layer": "power-line",
			"filter": ["all",
				["==", "kind", "line"],
				["in", "voltage"].concat(voltage_combos),
			],
			"layout": {
				"line-join": "miter"
			},
			"paint": {
				"line-width": {
					"base": 1.5,
					"stops": [
						[8, 1.5],
						[12, 3]
					]
				},
				"line-dasharray": [0, 2, 2]
			},
			"id": "line_secondary"
		}, {
			"type": "line",
			"source": "power",
			"source-layer": "power-line",
			"filter": ["all",
				["==", "kind", "line"],
				["!in", "voltage"].concat(voltage_combos),
				["!=", "frequency", "0"]
			],
			"layout": {
				"line-join": "miter"
			},
			"paint": {
				"line-width": {
					"base": 1.5,
					"stops": [
						[8, 1.5],
						[12, 3]
					]
				},
			},
			"id": "line"
		}, {
			"type": "line",
			"source": "power",
			"source-layer": "power-line",
			"filter": ["all",
				["==", "kind", "line"],
				["has", "voltage"],
				["==", "frequency", "0"]
			],
			"layout": {
				"line-join": "miter"
			},
			"paint": {
				"line-width": {
					"base": 1.5,
					"stops": [
						[8, 1.5],
						[12, 3]
					]
				},
			},
			"id": "line_hvdc"
		}];

		for (var line in lines) {
			var e = lines[line];
			e.id = pfx + e.id;
			e.filter.push(filter);
			this.map.addLayer(e, "powerline label");
		}
	}

	powerline_colors(pfx) {
		function color(c) {
			return c;
		}

		var line_stops = [];
		for (var e in voltage_colors) {
			var n = Number(e);
			if (n > 0) {
				line_stops.push([e, color(voltage_colors[e])]);
				line_stops.push([e + ';0', color(voltage_colors[e])]);
			}
		}
		this.map.setPaintProperty(pfx + 'cable', "line-color", {
			"property": "max_voltage",
			"type": "categorical",
			"default": color(voltage_colors.unknown),
			"stops": line_stops
		});
		this.map.setPaintProperty(pfx + 'line', "line-color", {
			"property": "voltage",
			"type": "categorical",
			"default": color(voltage_colors.unknown),
			"stops": line_stops
		});

		var primary_stops = [];
		var secondary_stops = [];
		for (var i = 0; i < voltage_combos.length; ++i) {
			var voltages = voltage_combos[i].split(';');
			if (!voltage_colors.hasOwnProperty(voltages[0])) console.log('missing', voltages[0]);
			if (!voltage_colors.hasOwnProperty(voltages[1])) console.log('missing', voltages[1]);
			primary_stops.push([voltage_combos[i], color(voltage_colors[voltages[0]])]);
			secondary_stops.push([voltage_combos[i], color(voltage_colors[voltages[1]])]);
		}
		this.map.setPaintProperty(pfx + 'line_primary', "line-color", {
			"property": "voltage",
			"type": "categorical",
			"default": color(voltage_colors.unknown),
			"stops": primary_stops
		});
		this.map.setPaintProperty(pfx + 'line_secondary', "line-color", {
			"property": "voltage",
			"type": "categorical",
			"default": color(voltage_colors.unknown),
			"stops": secondary_stops
		});

		this.map.setPaintProperty(pfx + 'cable_hvdc', "line-color", color(voltage_colors.HVDC));
		this.map.setPaintProperty(pfx + 'line_hvdc', "line-color", color(voltage_colors.HVDC));
	}

	powerlines() {
		this.powerline_base('otherline_', ["!=", "grid", "ercot"]);
		this.powerline_base('ercotline_', ["==", "grid", "ercot"]);
		this.powerline_colors('otherline_');
		this.powerline_colors('ercotline_');
	}

	power_areas() {
		this.map.addLayer({
			"id": "power area",
			"type": "line",
			"source": "power",
			"source-layer": "power-polygon",
			"filter": [
				"all",
				["in", "kind", "substation", "plant"],
			],
			"minzoom": 10,
			"paint": {
				"line-color": "hsl(0, 1%, 34%)",
				"line-width": 1
			}
		});
		this.map.addLayer({
			"id": "generator polygon",
			"source": "power",
			"source-layer": "power-polygon",
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
		this.map.addLayer({
			"id": "generator point",
			"source": "power",
			"source-layer": "power-point",
			"filter": [
				"all",
				["==", "kind", "generator"],
				["!=", "label_placement", true],
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
	}

	set_show_powerlines(show, highlight_ercot) {
		for (var layer in this.map.style._layers) {
			if (layer.startsWith('otherline_')) {
				this.map.setPaintProperty(layer, 'line-opacity', show ? (highlight_ercot ? 0.33 : 1) : 0);
			} else if (layer.startsWith('ercotline_')) {
				this.map.setPaintProperty(layer, 'line-opacity', show ? 1 : 0);
			}
		}
	}

	constructor(map, source) {
		this.map = map;

		map.addSource('power', {
			type: 'vector',
			tiles: [source],
			minzoom: 0,
			maxzoom: 16
		});

		this.power_areas();
		this.labels();
		this.powerlines();
	}
}

export default PowerStyle;
