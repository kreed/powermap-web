#!/usr/bin/python3
from fastkml import kml
from shapely.geometry.geo import mapping
import geojson
import requests

req = requests.get('http://ercot.com/content/cdr/contours/rtmSppPoints.kml')

k = kml.KML()
k.from_string(req.text)

osm_ids = []
features = []

try:
    with open('ercot_rtm.map', 'r') as f:
        for line in f:
            osm_ids.extend(line.split('\t'))
except:
    pass

for p in list(list(k.features())[0].features())[1].features():
    if not p.name in osm_ids:
        features.append(geojson.Feature(geometry=mapping(p.geometry), properties={'name': p.name, 'description': p.description}))

features = geojson.FeatureCollection(features)
with open('ercot_rtm.geojson', 'w') as f:
    geojson.dump(features, f)
