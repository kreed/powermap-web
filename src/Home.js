import React from 'react';
import Map from './Map';
import MapControl from './MapControl';

export default class Home extends React.Component {
	state = {
		mapOptions: { basemap: 'light', lines: true, plants: true, substations: true, grid: false, rtm: false }
	}

	render() {
		return (
			<div className='flex-container'>
				{this.props.children}
				<Map options={this.state.mapOptions} onMapMove={this.props.onMapMove} key={this.state.mapOptions.basemap}>
					<MapControl className='map-control' options={this.state.mapOptions} onChange={MapControl.mapControlChanged.bind(this)} />
				</Map>
			</div>
		);
	}
}
