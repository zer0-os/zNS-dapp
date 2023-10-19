import { version } from '../package.json';

//- React Imports
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

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';

import { WagmiConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

const metadata = {
	name: 'WWMM',
	description: 'Wilder World Metaverse Market',
	url: 'https://app.wilderworld.com/',
	icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const chains = [mainnet];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({ wagmiConfig, projectId, chains });

function App() {
	console.log(
		`%c${import.meta.env.VITE_TITLE} - v${version}`,
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
	const isProduction = import.meta.env.NODE_ENV === 'production';

	return (
		<CacheBuster
			currentVersion={version}
			isEnabled={isProduction}
			isVerboseMode={true}
		>
			<ReduxProvider store={store}>
				<WagmiConfig config={wagmiConfig}>
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
				</WagmiConfig>
			</ReduxProvider>
		</CacheBuster>
	);
}

export default wrappedApp;
