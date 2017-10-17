import React from 'react';
import { Container, Header, List } from 'semantic-ui-react'

const About = () => {
	return (
		<Container text style={{ marginTop: '2em' }}>
			<Header as='h1'>powermap</Header>
			<p>powermap provides a world-scale view of electricity infrastructure mapped in <a href='https://www.openstreetmap.org/'>OpenStreetMap</a>.</p>
			<p>I created OSM powermap as a successor to <a href='https://web.archive.org/web/20151028041431/http://www.itoworld.com/map/group/16'>ITOWorld's electricity maps</a>. ITOWorld provided excellent worldwide maps, but these maps only rendered powerlines with a limited set of voltages. I created powermap in an attempt to give every voltage level a distinct color.</p>
			<Header as='h2'>Mapping</Header>
			<p>Interested in adding data to this map? Head over to <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> and click Edit to start mapping.</p>
			<Header as='h2'>Software</Header>
			<p>powermap renders vector tiles client-side. Vector tiles are still expiremental for OpenStreetMap and most of the software is immature. The software stack has gone through several iterations. The following is what I've settled on for the moment.</p>
			<List bulleted>
				<List.Item><a href='https://gitlab.com/osm-c-tools/osmctools'>osmupdate/osmconvert</a> download, update and filter OpenStreetMap data</List.Item>
				<List.Item><a href='https://github.com/openstreetmap/osm2pgsql'>osm2pgsql</a> (with a hack to support site relations) imports data to the database</List.Item>
				<List.Item><a href='https://www.postgresql.org/'>PostgreSQL</a>/<a href='https://postgis.net/'>PostGIS</a> store the data</List.Item>
				<List.Item><a href='https://github.com/t-rex-tileserver/t-rex'>t-rex</a> generates and serves vector tiles</List.Item>
				<List.Item><a href='https://nginx.org/'>nginx</a> for caching</List.Item>
				<List.Item><a href='https://mapzen.com/products/tangram/'>Tangram</a> renders the map in the browser</List.Item>
			</List>
			<p>Code is available for the <a href='https://bitbucket.org/ceby/powermap-web'>frontend</a> and <a href='https://bitbucket.org/ceby/powermap-tiles'>backend</a>. I hope to provide installation instructions and documentation in the future.</p>
			<Header as='h2'>See also</Header>
			<p><a href='https://openinframap.org/'>Open Infrastructure Map</a></p>
		</Container>
	);
}

export default About;
