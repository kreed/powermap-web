import React from 'react'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = 'pk.eyJ1Ijoia3JlM2QiLCJhIjoiY2lwcjJrZ3p2MDZyOWZvbTN0bXV1eXF6ZiJ9.xXv_HMXLK04bEtmuwsEyMQ';

var voltage_colors = {
	"#cccccc": ["missing", "unknown"],
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

function pretty_key(str) {
	if (str === 'plant:source' || str === 'generator:source') return 'Fuel';
	if (str === 'plant:output:electricity' || str === 'generator:output:electricity') return 'Capacity';
	return str.replace(/[_:]/, ' ').replace(/^\w/g, l => l.toUpperCase());
}

function osm_url(feature) {
	var id = feature.properties.osm_id;
	var type = 'way';
	if (id < 0) {
		id = -id;
		type = 'relation';
	} else if (feature.properties.label_placement === 'false') {
		type = 'node';
	}
	return '//www.openstreetmap.org/' + type + '/' + id;
}

let Map = class Map extends React.Component {
	map;

	componentWillReceiveProps(nextProps) {
		if (this.props.grid !== nextProps.grid)
			this.powerline_colors(nextProps.grid)
		if (this.props.lines !== nextProps.lines)
			this.set_show_powerlines(nextProps.lines);
		if (this.props.plants !== nextProps.plants)
			this.set_show_plants(nextProps.plants);
		if (this.props.rtm !== nextProps.rtm)
			this.set_ercot_rtm(nextProps.rtm);
	}

	componentDidMount() {
		this.map = new mapboxgl.Map({
			container: this.mapContainer,
			style: 'mapbox://styles/kre3d/cjful4l500mjb2smihw06awcc',
			hash: true,
			center: [-98.34, 30.55],
			zoom: 6
		});
		window.map = this.map;

		this.map.on('load', this.styleLoaded);
	}

	render() {
		return (
			<div ref={el => this.mapContainer = el}>
				{this.props.children}
			</div>
		);
	}

	labels() {
		this.map.addLayer({
			"id": "powerline_label",
			"type": "symbol",
			"source": "power",
			"source-layer": "power-line",
			"filter": ["in", "kind", "line", "cable", "minor_line", "minor_cable"],
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
				"text-field": ["case", ["all", ["has", "cables"], ["has", "voltage_pretty"]], ["concat", ["get", "voltage_pretty"], " (", ["get", "cables"], ")"], ["has", "voltage_pretty"], ["get", "voltage_pretty"], ""]
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
			"id": "generator_label",
			"type": "symbol",
			"source": "power",
			"source-layer": "power-point",
			"filter": [
				"all",
				["==", "kind", "generator"],
			],
			"minzoom": 10,
			"layout": {
				"text-line-height": 1,
				"text-size": {
					"base": 1,
					"stops": [[12,11],[16,12]]
				},
				"symbol-avoid-edges": true,
				"text-transform": "uppercase",
				"text-font": [
					"DIN Offc Pro Medium",
					"Arial Unicode MS Regular"
				],
				"symbol-placement": "point",
				"text-padding": 3,
				"text-field": ["step", ["zoom"], "", 16, ["concat", ["string", ["get", "name"], ""], " ", ["string", ["get", "capacity_pretty"], ""]]],
				"text-letter-spacing": 0.1,
				"text-max-width": 7,
				"text-offset": [0, 2.5],
				"icon-size": ["interpolate", ["exponential", 1], ["zoom"], 9, 0.1, 16, 1.2],
				"icon-image": ["concat", ["to-string", ["get", "fuel"]], "_gen"],
				"icon-allow-overlap": true
			},
			"paint": {
				"text-halo-color": "#fff",
				"text-color": "hsl(0, 1%, 34%)",
				"text-halo-width": 1.5,
				"text-halo-blur": 0,
			}
		});
		this.map.addLayer({
			"id": "substation_point",
			"source": "power",
			"source-layer": "power-point",
			"filter": [
				"all",
				["==", "kind", "substation"]
			],
			"type": "circle",
			"maxzoom": 14,
			"paint": {
				"circle-color": "hsl(0, 100%, 71%)",
				"circle-stroke-color": "black",
				"circle-stroke-width": {
					"stops": [[5, 0], [6, 0.5], [12, 3]]
				},
				"circle-radius": {
					"stops": [[5, 0], [6, 2], [12, 6]]
				},
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
				"text-offset": [0, 3],
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
			"id": "plant_label",
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
				"text-anchor": "left",
				"icon-image": ["match", ["to-string", ["get", "fuel"]], "coal", "coal", "wind", "wind", "solar", "solar", "hydro", "hydro", "gas", "gas", "nuclear", "nuclear", "unknown_fuel"],
				"text-field": ["step", ["zoom"], "", 9, ["concat", ["string", ["get", "name"], ""], " ", ["string", ["get", "capacity_pretty"], ""]]],
				"text-letter-spacing": 0.1,
				"text-max-width": 7,
				"text-offset": [1, 0],
				"text-justify": "left",
				"icon-allow-overlap": true
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
	}

	set_ercot_rtm(visible) {
		if (!this.map.getSource('ercot_rtm'))
			this.ercot_rtm();
		this.map.setPaintProperty('ercot_rtm', 'circle-opacity', visible ? 1 : 0);
	}

	powerlines() {
		var map = this.map;
		function layer(name, filter, dash, size) {
			if (!size) size = { "base": 1.5, "stops": [[8, 1.5], [12, 3]] };
			var l = {
				"type": "line",
				"source": "power",
				"source-layer": "power-line",
				"filter": ["all",
					...filter
				],
				"layout": {
					"line-join": "miter"
				},
				"paint": {
					"line-width": size
				},
				"id": name
			}
			if (dash) l.paint["line-dasharray"] = dash;
			map.addLayer(l);
		}

		layer('line_cable',  [["==", "kind", "cable"]], [2, 2]);
		layer('line_0v',  [["==", "kind", "line"], ["==", "voltage_count", 0]]);
		layer('line_1v',  [["==", "kind", "line"], ["==", "voltage_count", 1]]);
		layer('line_2v1',  [["==", "kind", "line"], ["==", "voltage_count", 2]], [2, 2]);
		layer('line_2v2',  [["==", "kind", "line"], ["==", "voltage_count", 2]], [0, 2, 2]);
		layer('line_3v1',  [["==", "kind", "line"], ["==", "voltage_count", 3]], [2, 4]);
		layer('line_3v2',  [["==", "kind", "line"], ["==", "voltage_count", 3]], [0, 2, 2, 2]);
		layer('line_3v3',  [["==", "kind", "line"], ["==", "voltage_count", 3]], [0, 4, 2]);
		layer('line_minor',  [["==", "kind", "minor_line"]], null, 1.5);
		layer('line_minor_cable',  [["==", "kind", "minor_cable"]], [2, 2], 1.5);
	}

	powerline_colors(lighten_non_ercot) {
		function parse_color(c, lighten) {
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
				expression_base.push(voltages[i]);
				expression_base.push(parse_color(color));
				if (lighten_non_ercot) {
					expression_base.push("light" + voltages[i]);
					expression_base.push(parse_color(color, true));
				}
				colors[voltages[i]] = parse_color(color);
			}
		}
		expression_base.push(colors.unknown);

		var map = this.map;
		function apply_color(layer_name, voltage_key, color_key) {
			var v = ["case", ["==", "0", ["get", "frequency"]], "HVDC", ["to-string", ["get", voltage_key]]];
			if (lighten_non_ercot) {
				v = ["concat", ["case", ["==", ["get", "grid"], "ercot"], "", "light"], v];
			}
			map.setPaintProperty(layer_name, color_key || "line-color", ["match", v, ...expression_base]);
		}

		// TODO: whenever MVT supports array properties, we should use that here
		// instead of separate voltage..n keys.
		// https://github.com/mapbox/vector-tile-spec/issues/75
		this.map.setPaintProperty('line_0v', "line-color", colors.missing);
		apply_color('line_1v', 'max_voltage');
		apply_color('line_2v1', 'voltage1');
		apply_color('line_2v2', 'voltage2');
		apply_color('line_3v1', 'voltage1');
		apply_color('line_3v2', 'voltage2');
		apply_color('line_3v3', 'voltage3');
		apply_color('line_minor', 'max_voltage');
		apply_color('line_minor_cable', 'max_voltage');
		apply_color('line_cable', 'max_voltage');

		apply_color('substation_point', 'max_voltage', 'circle-color');
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
	}

	power_hizoom() {
		this.map.addLayer({
			"id": "symbols",
			"source": "power",
			"source-layer": "power-point",
			"filter": [
				"all",
				["in", "kind", "pole", "portal", "tower"]
			],
			"type": "symbol",
			"layout": {
				"icon-image": "{kind}"
			}
		});
	}

	set_show_plants(show) {
		this.map.setLayoutProperty('plant_label', 'visibility', show ? 'visible' : 'none');
	}

	set_show_powerlines(show) {
		for (var layer in this.map.style._layers) {
			if (layer.startsWith('line_')) {
				this.map.setPaintProperty(layer, 'line-opacity', show ? 1 : 0);
			}
		}
	}

	styleLoaded = () => {
		this.map.addSource('power', {
			type: 'vector',
			tiles: [this.props.tileUrl || "https://power.kreed.org/tiles/power/{z}/{x}/{y}.pbf"],
			minzoom: 0,
			maxzoom: 16
		});

		this.power_areas();
		this.powerlines();
		this.power_hizoom();
		this.labels();
		this.powerline_colors(this.props.grid);

		this.map.on('click', this.handleClick);

		if (!this.props.lines) this.set_show_powerlines(this.props.lines);
		if (!this.props.plants) this.set_show_plants(this.props.plants);
		if (this.props.rtm) this.set_ercot_rtm(this.props.rtm);
		if (this.props.onStyleLoad) this.props.onStyleLoad();
	}

	handleClick = (e) => {
		var layers = ['substation_point', 'generator_label', 'powerline_label'];
		if (this.props.plants) layers.push('plant_label');
		if (this.props.rtm) layers.push('ercot_rtm');
		var features = this.map.queryRenderedFeatures(e.point, { layers: layers });
		if (!features.length)
			return;

		var feature = features[0];
		var p = feature.properties;
		var html;
		if (feature.layer.id === 'ercot_rtm') {
			html = feature.properties.description;
		} else {
			var tags = JSON.parse(p.tags);
			html = '<strong>' + (p.name ? p.name : pretty_key(p.kind)) + '</strong>';
			if (p.voltage) html = html + '<br>Voltage: ' + p.voltage_pretty;
			for (var key in tags) {
				if (['capacity', 'max_voltage', 'voltage', 'voltage_normalized', 'voltage_count', 'name', 'osm_id', 'power', 'way_area', 'barrier'].includes(key)) continue;
				html = html + '<br>' + pretty_key(key) + ': ' + tags[key];
			}
			html = html + '<br>OpenStreetMap ID: <a href="' + osm_url(feature) + '">' + Math.abs(p.osm_id) + '</a>';
		}

		var coord = e.lngLat;
		if (feature.geometry.type === 'Point') coord = feature.geometry.coordinates;
		new mapboxgl.Popup()
			.setLngLat(coord)
			.setHTML(html)
			.addTo(this.map);
	}
}
export default Map;
