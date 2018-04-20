import React from 'react'
import Map from './Map'
import mbglCompare from 'mapbox-gl-compare'
import { Dropdown, Segment } from 'semantic-ui-react'

const yearOptions = [
	{text: '2014', value: '2014'},
	{text: '2015', value: '2015'},
	{text: '2016', value: '2016'},
	{text: '2017', value: '2017'}
];

export default class Compare extends React.Component {
	state = {
		year: '2014'
	}

	changeYear = (e, data) => {
		this.setState(prevState => ({
			year: data.value
		}));
	}

	componentDidMount() {
		new mbglCompare(this.oldMap.map, this.newMap.map);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		new mbglCompare(this.oldMap.map, this.newMap.map);
	}

	render() {
		return (
			<div className='compare-container'>
				<Map ref={el => this.oldMap = el} lines={true} tileUrl={'https://power.kreed.org/' + this.state.year + '/power' + this.state.year + '/{z}/{x}/{y}.pbf'} key={this.state.year} />
				<Map ref={el => this.newMap = el} lines={true} />
				<Segment inverted className='map-control'>
					<Dropdown selection options={yearOptions} onChange={this.changeYear} value={this.state.year} />
				</Segment>
				<Segment inverted className='map-control right'>Now</Segment>
			</div>
		);
	}
}
