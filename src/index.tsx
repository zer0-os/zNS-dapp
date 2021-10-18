import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { hydrate, render } from 'react-dom';

const rootElement = document.getElementById('root');

if (rootElement?.hasChildNodes()) {
	hydrate(
		<React.StrictMode>
			<head>
				<meta name="fortmatic-site-verification" content="fdtdkNpVYri6vfLG" />
			</head>
			<App />
		</React.StrictMode>,
		rootElement,
	);
} else {
	render(
		<React.StrictMode>
			<head>
				<meta name="fortmatic-site-verification" content="fdtdkNpVYri6vfLG" />
			</head>
			<App />
		</React.StrictMode>,
		rootElement,
	);
}

reportWebVitals();
