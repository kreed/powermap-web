import React from 'react'
import mapboxgl from 'mapbox-gl'
import PowerStyle from './powerstyle'

mapboxgl.accessToken = 'pk.eyJ1Ijoia3JlM2QiLCJhIjoiY2lwcjJrZ3p2MDZyOWZvbTN0bXV1eXF6ZiJ9.xXv_HMXLK04bEtmuwsEyMQ';

let Map = class Map extends React.Component {
	map;

	componentWillReceiveProps(nextProps) {
		if (this.style) {
			if (this.props.lines !== nextProps.lines || this.props.grid !== nextProps.grid)
				this.style.set_show_powerlines(nextProps.lines, nextProps.grid);
			if (this.props.rtm !== nextProps.rtm)
				this.style.set_ercot_rtm(nextProps.rtm);
		}
	}

	componentDidMount() {
		this.map = new mapboxgl.Map({
			container: this.mapContainer,
			style: 'mapbox://styles/mapbox/light-v9',
			hash: true,
			center: [-98.34, 30.55],
			zoom: 6
		});
		window.map = this.map;

		this.map.on('load', () => {
			this.style = new PowerStyle(this.map, "https://power.kreed.org/tiles/power/{z}/{x}/{y}.pbf");
		});
	}

	render() {
		return (
			<div ref={el => this.mapContainer = el}>
				{this.props.children}
			</div>
		);
	}
}

export default Map;
