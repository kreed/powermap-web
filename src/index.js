import React from 'react';
import ReactDOM from 'react-dom';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl-compare/dist/mapbox-gl-compare.css';
import 'semantic-ui-less/definitions/globals/site.less';
import 'semantic-ui-less/definitions/globals/reset.less';
import 'semantic-ui-less/definitions/modules/transition.less';
import 'semantic-ui-less/definitions/collections/menu.less';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
