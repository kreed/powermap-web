import React from 'react';
import Map from './Map';
import Checkbox from './Checkbox';

export default class App extends React.Component {
	state = {
		linesChecked: true,
		gridChecked: false,
		rtmChecked: false
	}

	linesChecked = () => {
		this.setState(prevState => ({
			linesChecked: !prevState.linesChecked
		}));
	}

	gridChecked = () => {
		this.setState(prevState => ({
			gridChecked: !prevState.gridChecked
		}));
	}

	rtmChecked = () => {
		this.setState(prevState => ({
			rtmChecked: !prevState.rtmChecked
		}));
	}

	render() {
		return (
			<div>
				<div id="checks">
					<Checkbox label="Show powerlines" checked={this.state.linesChecked} handler={this.linesChecked} />
					<Checkbox label="Highlight ERCOT lines" checked={this.state.gridChecked} handler={this.gridChecked} />
					<Checkbox label="Show ERCOT real-time market" checked={this.state.rtmChecked} handler={this.rtmChecked} />
				</div>
				<Map
					lines={this.state.linesChecked}
					grid={this.state.gridChecked}
					rtm={this.state.rtmChecked} />
			</div>
		);
	}
}
