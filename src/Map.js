import React from 'react';
import L from 'leaflet';
import 'leaflet-hash';

// -- Import Tangram --

// You can import the main library, but it takes forever to bundle, because
// it is already minified.
// import Tangram from 'tangram';

// This is faster, and will be minified anyway in production
import Tangram from 'tangram/dist/tangram.debug';

// -- LEAFLET: Fix Leaflet's icon paths for Webpack --
// See here: https://github.com/PaulLeCam/react-leaflet/issues/255
// Used in conjunction with url-loader.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
	iconUrl: require('leaflet/dist/images/marker-icon.png'),
	shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// NOTE: This uses React to create a "wrapper" component around an HTML element
// that Leaflet hooks into. This means you need to manage Leaflet's state
// manually, which may not be what you want to work in a pure React way.
// As an alternative, you may want to check out https://github.com/PaulLeCam/react-leaflet

export default class Map extends React.Component {
	componentDidMount() {
		var map_start_location = [30.55, -98.34, 6];
		const url_hash = window.location.hash.slice(1, window.location.hash.length).split('/');

		if (url_hash.length === 3) {
			map_start_location = [url_hash[1],url_hash[2],url_hash[0]];
			// convert from strings
			map_start_location = map_start_location.map(Number);
		}

		const map = L.map(this.mapEl, { zoomControl: false });
		const layer = Tangram.leafletLayer({
			scene: process.env.PUBLIC_URL + '/scene.yaml',
			attribution: '<a href="//mapzen.com/tangram" target="_blank" rel="noopener">Tangram</a> | &copy; OSM contributors | <a href="//mapzen.com/" target="_blank" rel="noopener">Mapzen</a>'
		});

		function onMapClick(selection) {
			if (selection.feature) {
				var latlng = selection.leaflet_event.latlng;
				L.popup()
					.setLatLng(latlng)
					.setContent(selection.feature.properties.description)
					.openOn(map);
			}
		}

		layer.addTo(map);
		layer.on('init', function() {
			layer.setSelectionEvents({
				click: onMapClick
			});
		});
		this._layer = layer;

		map.setView(map_start_location.slice(0, 3), map_start_location[2]);

		new L.Hash(map);
	}

	componentWillReceiveProps(nextProps) {
		if (this._layer && this._layer.scene && this._layer.scene.config) {
			const scene = this._layer.scene;
			scene.config.layers['power-line'].enabled = nextProps.lines;
			scene.config.global.ercotgrid = nextProps.grid;
			scene.config.layers.ercotrtm.enabled = nextProps.rtm;
			scene.updateConfig();
		}
	}

	render() {
		return (
			<div ref={(ref) => {this.mapEl = ref }}>
				{this.props.children}
			</div>
		);
	}
}

