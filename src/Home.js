import React from 'react';
import Map from './Map';
import MapControl from './MapControl';

export default class Home extends React.Component {
	state = {
		mapOptions: { lines: true, plants: true, grid: false, rtm: false }
	}

	mapControlChanged = (option) => {
		this.setState(prevState => {
			var opts = {...prevState.mapOptions};
			opts[option] = !opts[option];
			return { mapOptions: opts }
		});
	}

	render() {
		return (
			<Map options={this.state.mapOptions} onMapMove={this.props.onMapMove}>
				<MapControl className='map-control' options={this.state.mapOptions} onChange={this.mapControlChanged} />
			</Map>
		);
	}
}
