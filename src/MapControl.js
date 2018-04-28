import React from 'react';
import { Accordion, Button, Checkbox, Segment, List, Icon } from 'semantic-ui-react'

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

	static mapControlChanged(option, v) {
		this.setState(prevState => {
			var opts = {...prevState.mapOptions};
			if (option === 'basemap') {
				opts[option] = v;
			} else {
				opts[option] = !opts[option];
			}
			return { mapOptions: opts }
		});
	}

	render() {
		var opts = this.props.options;
		return (
			<Accordion as={Segment} inverted className={this.props.className}>
				<Accordion.Title index={0} active={this.state.open} onClick={this.openClose}>
					{this.state.open ? <Icon name='dropdown' /> : <Icon name='setting' fitted />}
					{this.state.open ? 'Map Settings' : null}
				</Accordion.Title>
				<Accordion.Content active={this.state.open}>
					<List celled>
						<Checkbox as={List.Item} toggle label="Lines" checked={opts.lines} onChange={()=>{ this.props.onChange('lines')}} />
						<Checkbox as={List.Item} toggle label="Substations" checked={opts.substations} onChange={()=>{this.props.onChange('substations')}} />
						<Checkbox as={List.Item} toggle label="Plants" checked={opts.plants} onChange={()=>{this.props.onChange('plants')}} />
						<Checkbox as={List.Item} toggle label="ERCOT grid" checked={opts.grid} onChange={()=>{this.props.onChange('grid')}} />
						<Checkbox as={List.Item} toggle label="ERCOT generators" checked={opts.rtm} onChange={()=>{this.props.onChange('rtm')}} />
					</List>
					<Button.Group>
						<Button inverted active={opts.basemap==='light'} onClick={()=>{this.props.onChange('basemap', 'light')}}>Light</Button>
						<Button inverted active={opts.basemap==='dark'} onClick={()=>{this.props.onChange('basemap', 'dark')}}>Dark</Button>
						<Button inverted active={opts.basemap==='sat'} onClick={()=>{this.props.onChange('basemap', 'sat')}}>Satellite</Button>
					</Button.Group>
				</Accordion.Content>
			</Accordion>
		);
	}
}
