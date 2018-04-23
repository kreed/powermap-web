import React from 'react';
import { Container, Header, List } from 'semantic-ui-react'

const About = () => {
	return (
		<Container text style={{ marginTop: '2em' }}>
			<Header as='h1'>powermap</Header>
			<p>powermap provides a worldwide view of electricity infrastructure mapped in <a href='https://www.openstreetmap.org/'>OpenStreetMap</a>.</p>
			<p>I created OSM powermap as a successor to <a href='https://web.archive.org/web/20151028041431/http://www.itoworld.com/map/group/16'>ITOWorld's electricity maps</a>. powermap makes use of vector tiles to enable more attributes to be rendered and advanced features like interactivity.</p>
			<Header as='h2'>Mapping</Header>
			<p>Interested in adding data to this map? Head over to <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> and click Edit to start mapping.</p>
			<Header as='h2'>Software</Header>
			<p>powermap renders vector tiles client-side thanks to the following components. Vector tiles are relatively new to OSM, and the software is still immature. I've gone through a few iterations of component choices as I work on getting things running smoothly. This is what I've settled on for the moment.</p>
			<List bulleted>
				<List.Item><a href='https://gitlab.com/osm-c-tools/osmctools'>osmupdate/osmconvert</a> download, update and filter OpenStreetMap data</List.Item>
				<List.Item><a href='https://github.com/openstreetmap/osm2pgsql'>osm2pgsql</a> (with a hack to support site relations) imports data to the database</List.Item>
				<List.Item><a href='https://www.postgresql.org/'>PostgreSQL</a>/<a href='https://postgis.net/'>PostGIS</a> store the data</List.Item>
				<List.Item><a href='https://github.com/t-rex-tileserver/t-rex'>t-rex</a> generates and serves vector tiles</List.Item>
				<List.Item><a href='https://nginx.org/'>nginx</a> for caching</List.Item>
				<List.Item><a href='https://www.mapbox.com/help/define-mapbox-gl/'>Mapbox GL</a> renders the map in the browser</List.Item>
			</List>
			<p>Code is available for the <a href='https://bitbucket.org/ceby/powermap-web'>frontend</a> and <a href='https://bitbucket.org/ceby/powermap-tiles'>backend</a>. I hope to provide installation instructions and documentation in the future.</p>
			<p>Fuel icons were created by Georgiana Ionescu and Oksana Latysheva at <a href="https://thenounproject.com/">the Noun Project. Other power symbols are from <a href='https://josm.openstreetmap.de/'>JOSM</a>.</a></p>
			<Header as='h2'>See also</Header>
			<p><a href='https://openinframap.org/'>Open Infrastructure Map</a></p>
		</Container>
	);
}

export default About;
