#!/bin/sh
kml=rtmLmpHgPoints.kml
json=ercot_rtm.geojson
wget -O $kml http://www.ercot.com/content/cdr/contours/$kml
togeojson $kml > $json
rm $kml
