import React from 'react';
import { matchPath } from 'react-router';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import { Menu, Responsive } from 'semantic-ui-react'

import About from './About';
import Home from './Home';
import Compare from './Compare';
import TPIT from './TPIT';

const MyNavLink = ({exact, ...rest}) => {
	const isActive = (match, location) => {
		// ignore hash when matching url (also discards search params as a side effect)
		return matchPath(location.pathname, {path: rest.to.replace(/#.*/, ''), exact});
	}
	return <NavLink activeClassName="active" isActive={isActive} {...rest} />;
}

export default class App extends React.Component {
	state = {
		hash: ''
	}

	mapMove = (hash) => {
		if (hash !== this.state.hash) {
			this.setState({hash: hash});
		}
	}

	render() {
		return <Router>
			<div className='flex-container'>
				<Menu inverted compact attached='top'>
					<Responsive as={Menu.Item} header minWidth={700}>OpenStreetMap power infrastructure</Responsive>
					<Menu.Item as={MyNavLink} to={'/' + this.state.hash} exact>Map</Menu.Item>
					<Menu.Item as={MyNavLink} to={'/compare' + this.state.hash}>Then and now</Menu.Item>
					<Menu.Item as={MyNavLink} to={'/tpit' + this.state.hash}>ERCOT projects</Menu.Item>
					<Menu.Item as={MyNavLink} to="/about">About</Menu.Item>
				</Menu>
				<Route exact path="/" render={props => ( <Home onMapMove={this.mapMove} /> )} />
				<Route path="/tpit" render={props => ( <TPIT onMapMove={this.mapMove} /> )} />
				<Route path="/compare" render={props => ( <Compare onMapMove={this.mapMove} /> )} />
				<Route path="/about" component={About} />
			</div>
		</Router>
	}
}
