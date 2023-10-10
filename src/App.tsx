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

//- Library Imports
import CacheBuster from 'react-cache-buster';
import EnlistProvider from 'lib/providers/EnlistProvider';
import CurrentDomainProvider from 'lib/providers/CurrentDomainProvider';
import MvpVersionProvider from 'lib/providers/MvpVersionProvider';

//- Page Imports
import PageContainer from 'containers/PageContainer';
import { ZnsSdkProvider } from 'lib/providers/ZnsSdkProvider';
import { ThemeEngine } from '@zero-tech/zui/components';
import { Themes } from '@zero-tech/zui/components/ThemeEngine';
import { ZUIProvider } from '@zero-tech/zui/ZUIProvider';
import { ROUTES } from './constants/routes';
import { Profile, Staking, ZNS } from './pages';
import DAO from './pages/DAO/DAO';

import { Web3ContextProvider } from 'lib/web3-connection/Web3ContextProvider';

function App() {
	console.log(
		`%c${process.env.REACT_APP_TITLE} - v${version}`,
		'display: block; border: 3px solid #52cbff; border-radius: 7px; padding: 10px; margin: 8px;',
	);

	return (
		<ConnectedRouter history={history}>
			<BrowserRouter>
				<Switch>
					<CurrentDomainProvider>
						<PageContainer>
							<Route path={'/:znsRoute/daos'}>
								<DAO />
							</Route>
							<Route path={'/staking'}>
								<Staking />
							</Route>
							<Route path={ROUTES.MARKET} component={ZNS} />
							<Route path={ROUTES.PROFILE} component={Profile} />
							<Route exact path="/">
								<Redirect to="/market" />
							</Route>
						</PageContainer>
					</CurrentDomainProvider>
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
				<Web3ContextProvider>
					<ZnsSdkProvider>
						{/* Our Hooks  */}
						<MvpVersionProvider>
							<EnlistProvider>
								<ZUIProvider>
									<ThemeEngine theme={Themes.Dark} />
									<App />
								</ZUIProvider>
							</EnlistProvider>
						</MvpVersionProvider>
					</ZnsSdkProvider>
				</Web3ContextProvider>
			</ReduxProvider>
		</CacheBuster>
	);
}

export default wrappedApp;
