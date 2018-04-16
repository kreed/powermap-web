import React from 'react';
import { Accordion, Checkbox, Segment, List, Icon } from 'semantic-ui-react'
import Map from './Map';

export default class Home extends React.Component {
	state = {
		linesChecked: true,
		gridChecked: false,
		rtmChecked: false,
		settingsOpen: false
	}

	componentDidMount() {
		if (window.matchMedia("(min-width: 500px)").matches) {
			this.setState({
				settingsOpen: true
			});
		}
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

	settingsClicked = () => {
		this.setState(prevState => ({
			settingsOpen: !prevState.settingsOpen
		}));
	}

	render() {
		return (
			<Map
				lines={this.state.linesChecked}
				grid={this.state.gridChecked}
				rtm={this.state.rtmChecked}>
				<Accordion as={Segment} inverted className='map-control'>
					<Accordion.Title index={0} active={this.state.settingsOpen} onClick={this.settingsClicked}>
						{this.state.settingsOpen ? <Icon name='dropdown' /> : <Icon name='setting' fitted />}
						{this.state.settingsOpen ? 'Map Settings' : null}
					</Accordion.Title>
					<Accordion.Content active={this.state.settingsOpen}>
						<List celled>
							<Checkbox as={List.Item} toggle label="Powerlines" checked={this.state.linesChecked} onChange={this.linesChecked} />
							<Checkbox as={List.Item} toggle label="ERCOT grid" checked={this.state.gridChecked} onChange={this.gridChecked} />
							<Checkbox as={List.Item} toggle label="ERCOT generators" checked={this.state.rtmChecked} onChange={this.rtmChecked} />
						</List>
					</Accordion.Content>
				</Accordion>
			</Map>
		);
	}
}
