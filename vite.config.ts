import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';
import inject from '@rollup/plugin-inject';

import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
	base: '/',
	plugins: [
		nodePolyfills({
			protocolImports: true,
			exclude: [
				'constants', // Excludes the polyfill for `http` and `node:http`.
			],
			globals: {
				Buffer: true, // can also be 'build', 'dev', or false
				global: true,
				process: true,
			},
		}),
		react(),
		viteTsconfigPaths(),
	],
	server: {
		open: false,
		port: 3000,
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
			react: resolve('node_modules/react'),
			'react-dom': resolve('node_modules/react-dom'),
			'react-router': resolve('node_modules/react-router'),
			'react-router-dom': resolve('node_modules/react-router-dom'),
		},
	},
	css: {
		modules: {
			scopeBehaviour: 'local',
			generateScopedName: '[name]_[local]_[hash:base64:5]',
		},
	},
	define: {
		// By default, Vite doesn't include shims for NodeJS/
		// necessary for segment analytics lib to work
		// global: {},
		// process: {
		// 	env,
		// },
	},
	build: {
		cssCodeSplit: false,
		rollupOptions: {
			plugins: [
				inject({
					modules: { Buffer: ['buffer', 'Buffer'] },
				}),
			],
			external: ['graphql'],
		},
	},
});
