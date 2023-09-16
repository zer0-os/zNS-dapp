const path = require('path');

module.exports = {
	webpack: {
		configure: (webpackConfig) => {
			webpackConfig.module.rules.push({
				test: /\.mjs$/,
				include: /node_modules/,
				type: 'javascript/auto',
			});
			return webpackConfig;
		},
		alias: {
			react: path.resolve('node_modules/react'),
			'react-dom': path.resolve('node_modules/react-dom'),
			'react-router': path.resolve('node_modules/react-router'),
			'react-router-dom': path.resolve('node_modules/react-router-dom'),
		},
	},
};
