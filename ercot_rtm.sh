#!/bin/sh
kml=rtmLmpHgPoints.kml
json=ercot_rtm.geojson
wget -O $kml http://www.ercot.com/content/cdr/contours/$kml
./node_modules/.bin/togeojson $kml > $json
rm $kml
