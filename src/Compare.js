import React from 'react'
import Map from './Map'
import mapboxgl from 'mapbox-gl'
import Compare from 'mapbox-gl-compare'

export default class TPIT extends React.Component {
	componentDidMount() {
		console.log(Compare);
		new Compare(this.oldMap.map, this.newMap.map);
	}

	render() {
		return (
			<div className='compare-container'>
				<Map ref={el => this.oldMap = el} lines={true} tileUrl="https://power.kreed.org/2014/power2014/{z}/{x}/{y}.pbf" />
				<Map ref={el => this.newMap = el} lines={true} />
			</div>
		);
	}
}
