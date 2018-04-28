import React from 'react'
import Map from './Map'
import MapControl from './MapControl';
import mbglCompare from 'mapbox-gl-compare'
import { Dropdown } from 'semantic-ui-react'

const yearOptions = [
	{text: 'Now', value: 'now'},
	{text: '2017', value: '2017'},
	{text: '2016', value: '2016'},
	{text: '2015', value: '2015'},
	{text: '2014', value: '2014'},
];

function yearUrl(year) {
	if (year === 'now') return null;
	return 'https://power.kreed.org/' + year + '/power' + year + '/{z}/{x}/{y}.pbf'
}

export default class Compare extends React.Component {
	state = {
		mapOptions: { ...Map.defaults, plants: false },
		leftYear: '2014',
		rightYear: 'now'
	}

	leftYear = (e, data) => {
		this.setState(prevState => ({
			leftYear: data.value
		}));
	}

	rightYear = (e, data) => {
		this.setState(prevState => ({
			rightYear: data.value
		}));
	}

	componentDidMount() {
		this.mbglcmp = new mbglCompare(this.leftMap.map, this.rightMap.map);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevState.leftYear !== this.state.leftYear || prevState.rightYear !== this.state.rightYear || prevState.mapOptions.basemap !== this.state.mapOptions.baseMap) {
			this.mbglcmp._container.remove();
			this.mbglcmp = new mbglCompare(this.leftMap.map, this.rightMap.map);
		}
	}

	render() {
		return (
			<div className='flex-container'>
				{this.props.children}
				<div className='compare-container'>
					<Map ref={el => this.leftMap = el} options={this.state.mapOptions} tileUrl={yearUrl(this.state.leftYear)} key={'left' + this.state.leftYear + this.state.mapOptions.basemap} onMapMove={this.props.onMapMove} />
					<Map ref={el => this.rightMap = el} options={this.state.mapOptions} tileUrl={yearUrl(this.state.rightYear)} key={'right' + this.state.rightYear + this.state.mapOptions.basemap} />
					<div className='ui map-control'>
						<Dropdown compact selection options={yearOptions} onChange={this.leftYear} value={this.state.leftYear} />
						<MapControl options={this.state.mapOptions} onChange={MapControl.mapControlChanged.bind(this)} />
					</div>
					<Dropdown className='map-control right' compact selection options={yearOptions} onChange={this.rightYear} value={this.state.rightYear} />
				</div>
			</div>
		);
	}
}
