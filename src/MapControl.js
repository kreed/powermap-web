import React from 'react';
import { Accordion, Checkbox, Segment, List, Icon } from 'semantic-ui-react'

export default class MapControl extends React.Component {
	state = {
		open: false
	}

	componentDidMount() {
		if (window.matchMedia("(min-width: 500px)").matches) {
			this.setState({
				open: true
			});
		}
	}

	openClose = () => {
		this.setState(prevState => ({
			open: !prevState.open
		}));
	}

	render() {
		return (
			<Accordion as={Segment} inverted className={this.props.className}>
				<Accordion.Title index={0} active={this.state.open} onClick={this.openClose}>
					{this.state.open ? <Icon name='dropdown' /> : <Icon name='setting' fitted />}
					{this.state.open ? 'Map Settings' : null}
				</Accordion.Title>
				<Accordion.Content active={this.state.open}>
					<List celled>
						<Checkbox as={List.Item} toggle label="Lines" checked={this.props.options.lines} onChange={()=>{ this.props.onChange('lines')}} />
						<Checkbox as={List.Item} toggle label="Plants" checked={this.props.options.plants} onChange={()=>{this.props.onChange('plants')}} />
						<Checkbox as={List.Item} toggle label="Substations" checked={this.props.options.substations} onChange={()=>{this.props.onChange('substations')}} />
						<Checkbox as={List.Item} toggle label="ERCOT grid" checked={this.props.options.grid} onChange={()=>{this.props.onChange('grid')}} />
						<Checkbox as={List.Item} toggle label="ERCOT generators" checked={this.props.options.rtm} onChange={()=>{this.props.onChange('rtm')}} />
					</List>
				</Accordion.Content>
			</Accordion>
		);
	}
}
