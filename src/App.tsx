import { version } from '../package.json';

//- React Imports
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

//- Redux Store Imports
import store, { history } from './store';

//- Global Stylesheets
import 'styles/reset.scss';
import 'styles/main.scss';

//- React Imports
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

//- Web3 Imports
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

//- Library Imports
import CacheBuster from 'react-cache-buster';
import EnlistProvider from 'lib/providers/EnlistProvider';
import MvpVersionProvider from 'lib/providers/MvpVersionProvider';
import { ZnsSdkProvider } from 'lib/providers/ZnsSdkProvider';

//- Page Imports
import { ZNS, Staking, Profile, Maintenance, Error } from 'pages';
import DAO from 'pages/DAO/DAO';

//- Constants Imports
import { ROUTES } from 'constants/routes';

function getLibrary(provider: any): Web3Provider {
	const library = new Web3Provider(provider);
	library.pollingInterval = 12000;
	return library;
}
function App() {
	console.log(
		`%cWilder World Marketplace v${version}`,
		'display: block; border: 3px solid #52cbff; border-radius: 7px; padding: 10px; margin: 8px;',
	);
	return (
		<ConnectedRouter history={history}>
			<BrowserRouter>
				<Switch>
					<Route exact path="/">
						<Redirect to={ROUTES.MARKET} />
					</Route>
					<Route path={ROUTES.MARKET} component={ZNS} />
					<Route path={ROUTES.STAKING} component={Staking} />
					<Route path={ROUTES.ZDAO} component={DAO} />
					<Route path={ROUTES.PROFILE} component={Profile} />

					<Route path={ROUTES.ERROR} component={Error} />
					<Route path={ROUTES.MAINTENANCE} component={Maintenance} />
					{/* <Route component={PageNotFound} /> */}
				</Switch>
			</BrowserRouter>
		</ConnectedRouter>
	);
}
function wrappedApp() {
	const isProduction = process.env.NODE_ENV === 'production';
	return (
		<CacheBuster
			currentVersion={version}
			isEnabled={isProduction}
			isVerboseMode={true}
		>
			<ReduxProvider store={store}>
				<Web3ReactProvider getLibrary={getLibrary}>
					<ZnsSdkProvider>
						{/* Our Hooks  */}
						<MvpVersionProvider>
							<EnlistProvider>
								<App />
							</EnlistProvider>
						</MvpVersionProvider>
					</ZnsSdkProvider>
				</Web3ReactProvider>
			</ReduxProvider>
		</CacheBuster>
	);
}
export default wrappedApp;
