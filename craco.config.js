/**
 * CRACO = Create React App Config Override
 */

const fs = require('fs');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());

// eslint-disable-next-line no-unused-vars
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

module.exports = {
	webpack: {
		/**
		 * These aliases ensure that any packages linked through `npm link`
		 * will use this packages dependencies, rather than their own.
		 *
		 * [dependency]: path.resolve([path to dependency])
		 */
		alias: {
			react: path.resolve('./node_modules/react'),
			'react-dom': path.resolve('./node_modules/react-dom'),
			'react-router': path.resolve('./node_modules/react-router'),
			'react-router-dom': path.resolve('./node_modules/react-router-dom'),
		},
	},
	plugins: [
		{
			plugin: require('craco-babel-loader'),
			options: {
				/*
				 * Add any packages that you have linked (through `npm link`)
				 * to this array using the resolveApp function, e.g.
				 * includes: [resolveApp('../zFi-dapp'), resolveApp('../zUI')]
				 *
				 * If you don't do this, you'll get compile errors because babel
				 * won't be running on your linked libraries.
				 *
				 * Note: if you're linking zFi-dapp, and zUI is linked into zFi-dapp
				 * you need to put zUI in _this_ package's CRACO config rather
				 * than zFi-dapp.
				 */
				includes: [],
			},
		},
	],
};
