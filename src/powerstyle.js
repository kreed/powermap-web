import mapboxgl from 'mapbox-gl'

var unknown_voltage_color = [0.33,0.33,0.33];
var hvdc_color = [0.459,1,0.953];
var voltage_colors = {
	1000000: [0.816,0.482,0.529],
	800000: [0.533,0.18,0.447],
	765000: [0.776,0.251,0.851],
	750000: [0.776,0.251,0.851],
	735000: [0.839,0.349,0.718],
	660000: [0.839,0.349,0.718],
	525000: [0.337,0.2,0.537],
	500000: [0.337,0.2,0.537],
	450000: [0.337,0.2,0.537],
	440000: [0.631,0.643,0.259],
	420000: [0.631,0.643,0.259],
	400000: [0.631,0.643,0.259],
	380000: [0.796,0.529,0.631],
	360000: [0.796,0.529,0.631],
	350000: [0.796,0.529,0.631],
	345000: [0.761,0.243,0.38],
	330000: [0.761,0.243,0.38],
	315000: [0.761,0.243,0.38],
	300000: [0.761,0.243,0.38],
	287000: [0.91,0.376,0.11],
	275000: [0.91,0.376,0.11],
	240000: [0.945,0.576,0.176],
	230000: [0.945,0.576,0.176],
	225000: [0.945,0.576,0.176],
	220000: [0.804,0.286,0.22],
	187000: [0.804,0.286,0.22],
	170000: [0.804,0.286,0.22],
	161000: [0.098,0.396,0.69],
	154000: [0.098,0.396,0.69],
	150000: [0.098,0.396,0.69],
	144000: [0.098,0.396,0.69],
	138000: [0.098,0.396,0.69],
	132000: [0.098,0.396,0.69],
	130000: [0.098,0.396,0.69],
	125000: [0.482,0.686,0.871],
	120000: [0.482,0.686,0.871],
	115000: [0.482,0.686,0.871],
	113000: [0.482,0.686,0.871],
	110000: [0.482,0.686,0.871],
	100000: [0.482,0.686,0.871],
	90000: [0.482,0.686,0.871],
	77000: [0.482,0.686,0.871],
	72000: [0.306,0.698,0.396],
	70000: [0.306,0.698,0.396],
	69000: [0.306,0.698,0.396],
	66000: [0.306,0.698,0.396],
	65000: [0.306,0.698,0.396],
	63000: [0.306,0.698,0.396],
	60000: [0.506,0.557,0.22],
	55000: [0.506,0.557,0.22],
	50000: [0.506,0.557,0.22],
	46000: [0.506,0.557,0.22],
	35000: [0.494,0.286,0.176],
	34500: [0.494,0.286,0.176],
	33000: [0.494,0.286,0.176],
	22000: [0.494,0.286,0.176],
	20000: [0.494,0.286,0.176],
}

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
				"text-field": "{voltage_pretty} {cables_pretty}"
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
				"text-field": "{name} {capacity_pretty}",
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
				"text-field": "{name} {voltage_pretty}",
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
				"text-field": "{name} {capacity_pretty} {fuel}",
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
				["==", "voltage_count", 0]
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
			"id": "line_0v"
		}, {
			"type": "line",
			"source": "power",
			"source-layer": "power-line",
			"filter": ["all",
				["==", "kind", "line"],
				["==", "voltage_count", 1],
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
			"id": "line_1v"
		}, {
			"type": "line",
			"source": "power",
			"source-layer": "power-line",
			"filter": ["all",
				["==", "kind", "line"],
				["==", "voltage_count", 2],
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
				["==", "voltage_count", 2],
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

	powerline_colors(pfx, lighten) {
		function color(c) {
			if (lighten) {
				return 'rgb(' + (c[0] + (1 - c[0]) / 2) * 255 + ',' + (c[1] + (1 - c[1]) / 2) * 255  + ',' + (c[2] + (1 - c[2]) / 2) * 255 + ')';
			} else {
				return 'rgb(' + c[0] * 255 + ',' + c[1] * 255 + ',' + c[2] * 255 + ')';
			}
		}

		var expression_base = [];
		for (var e in voltage_colors) {
			var n = Number(e);
			if (n > 0) {
				expression_base.push(n);
				expression_base.push(color(voltage_colors[e]));
			}
		}

		this.map.setPaintProperty(pfx + 'line_1v', "line-color", [
			"match",
			["number", ["get", "max_voltage"]],
			...expression_base,
			color(unknown_voltage_color)
		]);
		this.map.setPaintProperty(pfx + 'cable', "line-color", [
			"match",
			["number", ["get", "max_voltage"]],
			...expression_base,
			color(unknown_voltage_color)
		]);
		// TODO: whenever MVT supports array properties, we should use that here
		// instead of separate keys. https://github.com/mapbox/vector-tile-spec/issues/75
		this.map.setPaintProperty(pfx + 'line_primary', "line-color", [
			"match",
			["number", ["get", "voltage1"]],
			...expression_base,
			color(unknown_voltage_color)
		]);
		this.map.setPaintProperty(pfx + 'line_secondary', "line-color", [
			"match",
			["number", ["get", "voltage2"]],
			...expression_base,
			color(unknown_voltage_color)
		]);

		this.map.setPaintProperty(pfx + 'line_0v', "line-color", color(unknown_voltage_color));
		this.map.setPaintProperty(pfx + 'cable_hvdc', "line-color", color(hvdc_color));
		this.map.setPaintProperty(pfx + 'line_hvdc', "line-color", color(hvdc_color));
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

	set_highlight_ercot(highlight) {
		if (highlight) {
			this.powerline_colors('otherline_', true);
		} else {
			this.powerline_colors('otherline_');
		}
	}

	set_show_powerlines(show) {
		for (var layer in this.map.style._layers) {
			if (layer.startsWith('otherline_') || layer.startsWith('ercotline_')) {
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
