import React from 'react'
import mapboxgl from 'mapbox-gl'
import PowerStyle from './powerstyle'

mapboxgl.accessToken = 'pk.eyJ1Ijoia3JlM2QiLCJhIjoiY2lwcjJrZ3p2MDZyOWZvbTN0bXV1eXF6ZiJ9.xXv_HMXLK04bEtmuwsEyMQ';

let Map = class Map extends React.Component {
	map;

	constructor(props) {
		super(props);
		this.styleLoaded = this.styleLoaded.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		console.log(nextProps, this.style);
		if (this.style) {
			if (this.props.grid !== nextProps.grid)
				this.style.set_highlight_ercot(nextProps.grid)
			if (this.props.lines !== nextProps.lines)
				this.style.set_show_powerlines(nextProps.lines);
			if (this.props.rtm !== nextProps.rtm)
				this.style.set_ercot_rtm(nextProps.rtm);
		}
	}

	styleLoaded() {
		this.style = new PowerStyle(this.map, "https://power.kreed.org/tiles/power/{z}/{x}/{y}.pbf");
		this.style.set_highlight_ercot(this.props.grid)
		if (this.props.onStyleLoad) this.props.onStyleLoad();
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
}

export default Map;
