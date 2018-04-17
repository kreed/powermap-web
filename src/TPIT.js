import React from 'react'
import Map from './Map';
import mapboxgl from 'mapbox-gl'

export default class TPIT extends React.Component {
	initStyle = () => {
		var map = this.mapComponent.map;

		map.removeLayer('plant_label');

		map.addSource("counties", {
			"type": "geojson",
			"data": process.env.PUBLIC_URL + '/tpit.geojson'
		});

		map.addLayer({
			"id": "county",
			"type": "fill",
			"source": "counties",
			"paint": {
				"fill-outline-color": "#000",
				'fill-color': {
					property: 'project_count',
					stops: [
						[0, '#888888'],
						[1, '#F2F12D'],
						[2, '#EED322'],
						[3, '#E6B71E'],
						[5, '#DA9C20'],
						[8, '#CA8323'],
						[15, '#B86B25'],
						[20, '#A25626'],
						[35, '#8B4225'],
						[50, '#723122']
					]
				},
				"fill-opacity": 0.4
			},
		}, 'power area');

		map.on('click', function (e) {
			var features = map.queryRenderedFeatures(e.point, { layers: ['county'] });
			if (features.length) {
				var html = '';
				var projects = JSON.parse(features[0].properties.projects);

				for (var i = 0; i < projects.length; ++i) {
					var p = projects[i];
					var rows = [p.title, p.transmission_owner, p.sheet_date, p.projected_in_service, p.sheet_status];
					html += '<tr title="' + p.description + '"><td>' + rows.join('</td><td>') + '</td></tr>';
				}

				if (html) {
					new mapboxgl.Popup()
						.setLngLat(e.lngLat)
						.setHTML('<table>' + html + '</table>')
						.addTo(map);
				}
			}
		});
	}

	render() {
		return (
			<Map ref={el => this.mapComponent = el}
				lines={true}
				grid={true}
				onStyleLoad={this.initStyle} />
		);
	}
}
