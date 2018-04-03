import mapboxgl from 'mapbox-gl'

var voltage_colors = {
	"#cccccc": ["missing"],
	"#444444": ["unknown"],
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
		function parse_color(c) {
			c = parseInt(c.substring(1), 16)
			var r = (c >> 16) & 0xff;
			var g = (c >> 8) & 0xff;
			var b = c & 0xff;
			if (lighten) {
				return 'rgb(' + (r / 2 + 128) + ',' + (g / 2 + 128)  + ',' + (b / 2 + 128) + ')';
			} else {
				return 'rgb(' + r + ',' + g + ',' + b + ')';
			}
		}

		var expression_base = [];
		var colors = {};
		for (var color in voltage_colors) {
			var voltages = voltage_colors[color];
			for (var i = 0; i < voltages.length; ++i) {
				var n = Number(voltages[i]);
				if (n > 0) {
					expression_base.push(n);
					expression_base.push(parse_color(color));
				} else {
					colors[voltages[i]] = parse_color(color);
				}
			}
		}
		expression_base.push(colors.unknown);

		this.map.setPaintProperty(pfx + 'line_1v', "line-color", ["match", ["number", ["get", "max_voltage"]], ...expression_base]);
		this.map.setPaintProperty(pfx + 'cable', "line-color", ["match", ["number", ["get", "max_voltage"]], ...expression_base]);
		// TODO: whenever MVT supports array properties, we should use that here
		// instead of separate keys. https://github.com/mapbox/vector-tile-spec/issues/75
		this.map.setPaintProperty(pfx + 'line_primary', "line-color", ["match", ["number", ["get", "voltage1"]], ...expression_base]);
		this.map.setPaintProperty(pfx + 'line_secondary', "line-color", ["match", ["number", ["get", "voltage2"]], ...expression_base]);

		this.map.setPaintProperty(pfx + 'line_0v', "line-color", colors.missing);
		this.map.setPaintProperty(pfx + 'cable_hvdc', "line-color", colors.HVDC);
		this.map.setPaintProperty(pfx + 'line_hvdc', "line-color", colors.HVDC);
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
