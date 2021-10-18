import React from 'react';
import { render as Render } from 'react-snapshot';
import App from './App';
import reportWebVitals from './reportWebVitals';

Render(
	<React.StrictMode>
		<head>
			<meta name="fortmatic-site-verification" content="fdtdkNpVYri6vfLG" />
		</head>
		<App />
	</React.StrictMode>,
	document.getElementById('root'),
);

reportWebVitals();
