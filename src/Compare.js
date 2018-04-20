import React from 'react'
import Map from './Map'
import mbglCompare from 'mapbox-gl-compare'
import { Dropdown } from 'semantic-ui-react'

const yearOptions = [
	{text: '2014', value: '2014'},
	{text: '2015', value: '2015'},
	{text: '2016', value: '2016'},
	{text: '2017', value: '2017'},
	{text: 'Now', value: 'now'}
];

function yearUrl(year) {
	if (year === 'now') return null;
	return 'https://power.kreed.org/' + year + '/power' + year + '/{z}/{x}/{y}.pbf'
}

export default class Compare extends React.Component {
	state = {
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
		this.mbglcmp._container.remove();
		this.mbglcmp = new mbglCompare(this.leftMap.map, this.rightMap.map);
	}

	render() {
		return (
			<div className='compare-container'>
				<Map ref={el => this.leftMap = el} lines={true} tileUrl={yearUrl(this.state.leftYear)} key={'left' + this.state.leftYear} />
				<Map ref={el => this.rightMap = el} lines={true} tileUrl={yearUrl(this.state.rightYear)} key={'right' + this.state.rightYear} />
				<Dropdown className='map-control' compact selection options={yearOptions} onChange={this.leftYear} value={this.state.leftYear} />
				<Dropdown className='map-control right' compact selection options={yearOptions} onChange={this.rightYear} value={this.state.rightYear} />
			</div>
		);
	}
}
