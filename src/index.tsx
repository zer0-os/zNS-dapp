import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

//Adding Hydrate for Twitter Card update
import { hydrate } from 'react-dom';

const rootElement = document.getElementById('root');
if (rootElement?.hasChildNodes()) {
	hydrate(
		<React.StrictMode>
			<head>
				<meta name="fortmatic-site-verification" content="fdtdkNpVYri6vfLG" />
			</head>
			<App />
		</React.StrictMode>,
		document.getElementById('root'),
	);
} else {
	ReactDOM.render(
		<React.StrictMode>
			<head>
				<meta name="fortmatic-site-verification" content="fdtdkNpVYri6vfLG" />
			</head>
			<App />
		</React.StrictMode>,
		document.getElementById('root'),
	);
}

reportWebVitals();
