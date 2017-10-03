import React from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import { Menu, Responsive } from 'semantic-ui-react'

import Home from './Home';

const App = () => {
	return (
		<Router>
			<div className='flex-container'>
				<Menu inverted compact attached='top'>
					<Responsive as={Menu.Item} header minWidth={700}>OpenStreetMap power infrastructure</Responsive>
					<Menu.Item as={NavLink} activeClassName="active" to="/">Map</Menu.Item>
					<Menu.Item as={NavLink} activeClassName="active" to="/tpit">ERCOT project tracking</Menu.Item>
					<Menu.Item as={NavLink} activeClassName="active" to="/about">About</Menu.Item>
				</Menu>
				<Route exact path="/" component={Home} />
			</div>
		</Router>
	);
}

export default App;
