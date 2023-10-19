// @ts-ignore
window.global ||= window;

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

if (window.ethereum) {
	// @ts-ignore
	window.ethereum.autoRefreshOnNetworkChange = false;
}

// @ts-ignore
// window.Buffer = Buffer;

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root'),
);

reportWebVitals();
