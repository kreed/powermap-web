<?php

header('Expires: Sun, 01 Jan 2014 00:00:00 GMT');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Cache-Control: post-check=0, pre-check=0', FALSE);
header('Pragma: no-cache');
header('Content-Type: application/vnd.google-earth.kml+xml');
//header('Content-Type: application/vnd.geo+json');

$cache_file = "ercot_gen.kml";

if (!file_exists($cache_file) || filemtime($cache_file) < time() - 60 * 5) {
	$data = file_get_contents('http://www.ercot.com/content/cdr/contours/rtmLmpHgPoints.kml');
	file_put_contents($cache_file, $data);
} else {
	$data = file_get_contents($cache_file);
}

echo $data;

//system('./node_modules/.bin/togeojson ercot_gen.kml');
