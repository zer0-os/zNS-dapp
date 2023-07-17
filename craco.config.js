const path = require('path');
const fs = require('fs');
const cracoBabelLoader = require('craco-babel-loader');

// manage relative paths to packages
const appDirectory = fs.realpathSync(process.cwd());
const resolvePackage = (relativePath) =>
	path.resolve(appDirectory, relativePath);

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
			react: path.resolve('./node_modules/react'),
			'react-dom': path.resolve('./node_modules/react-dom'),
			'react-router': path.resolve('./node_modules/react-router'),
			'react-router-dom': path.resolve('./node_modules/react-router-dom'),
		},
	},
	plugins: [
		{
			plugin: cracoBabelLoader,
			options: {
				includes: [
					resolvePackage('node_modules/@radix-ui/react-tooltip'),
					resolvePackage('node_modules/@zero-tech/zui'),
					// resolvePackage('node_modules/another-package-to-transpile'),
				],
			},
		},
	],
};
