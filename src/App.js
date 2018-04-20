import React from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import { Menu, Responsive } from 'semantic-ui-react'

import About from './About';
import Home from './Home';
import Compare from './Compare';
import TPIT from './TPIT';

const App = () => {
	return (
		<Router>
			<div className='flex-container'>
				<Menu inverted compact attached='top'>
					<Responsive as={Menu.Item} header minWidth={700}>OpenStreetMap power infrastructure</Responsive>
					<Menu.Item as={NavLink} activeClassName="active" to="/" exact>Map</Menu.Item>
					<Menu.Item as={NavLink} activeClassName="active" to="/compare">Then and now</Menu.Item>
					<Menu.Item as={NavLink} activeClassName="active" to="/tpit">ERCOT projects</Menu.Item>
					<Menu.Item as={NavLink} activeClassName="active" to="/about">About</Menu.Item>
				</Menu>
				<Route exact path="/" component={Home} />
				<Route path="/tpit" component={TPIT} />
				<Route path="/compare" component={Compare} />
				<Route path="/about" component={About} />
			</div>
		</Router>
	);
}

export default App;
