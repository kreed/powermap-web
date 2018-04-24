import React from 'react';
import { BrowserRouter as Router, Route, NavLink, Switch, matchPath } from 'react-router-dom';
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

const Page = ({as, onMapMove, hash, ...rest}) => {
	return <Route path="/" render={props => (
		React.createElement(as, {onMapMove},
			<Menu inverted compact attached='top'>
				<Responsive as={Menu.Item} header minWidth={700}>OpenStreetMap power infrastructure</Responsive>
				<Menu.Item as={MyNavLink} to={'/' + hash} exact>Map</Menu.Item>
				<Menu.Item as={MyNavLink} to={'/compare' + hash}>Then and now</Menu.Item>
				<Menu.Item as={MyNavLink} to={'/tpit' + hash}>ERCOT projects</Menu.Item>
				<Menu.Item as={MyNavLink} to="/about">About</Menu.Item>
			</Menu>
		)
	)} {...rest} />
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
			<Switch>
				<Page exact path="/" as={Home} onMapMove={this.mapMove} hash={this.state.hash} />
				<Page path="/compare" as={Compare} onMapMove={this.mapMove} hash={this.state.hash} />
				<Page path="/tpit" as={TPIT} onMapMove={this.mapMove} hash={this.state.hash} />
				<Page path="/about" as={About} onMapMove={this.mapMove} hash={this.state.hash} />
			</Switch>
		</Router>
	}
}
