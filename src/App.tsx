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
import { HashRouter, Route } from 'react-router-dom';

//- Web3 Imports
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

//- Library Imports
import CacheBuster from 'react-cache-buster';
import MintProvider from 'lib/providers/MintProvider';
import BidProvider from 'lib/providers/BidProvider';
import EnlistProvider from 'lib/providers/EnlistProvider';
import TransferProvider from './lib/providers/TransferProvider';
import { ChainSelectorProvider } from 'lib/providers/ChainSelectorProvider';
import { SubgraphProvider } from 'lib/providers/SubgraphProvider';
import CurrentDomainProvider from 'lib/providers/CurrentDomainProvider';

//- Asset Imports
import backgroundImage from 'assets/background.jpg';

//- Page Imports
import { Navigator } from 'containers';
import { ZNS } from 'pages';
import StakingRequestProvider from 'lib/providers/StakingRequestProvider';
import { ZNSDomainsProvider } from 'lib/providers/ZNSDomainProvider';
import { network } from 'lib/connectors';

// Web3 library to query
function getLibrary(provider: any): Web3Provider {
	console.log('>> RUN GET LIBRARY <<');
	const library = new Web3Provider(provider);
	library.pollingInterval = 12000;
	return library;
}

function App() {
	const connector = useWeb3React();

	// Load default Infura connector if no wallet connected
	if (!connector.active) {
		connector.activate(network);
	}

	console.log(
		`%cWilder World Staking v${version}`,
		'display: block; border: 3px solid #52cbff; border-radius: 7px; padding: 10px; margin: 8px;',
	);

	// Programatically load the background image
	const loadImg = new Image();
	loadImg.src = backgroundImage;
	if (loadImg.complete) {
		document.body.style.backgroundImage = `url(${backgroundImage})`;
	} else {
		loadImg.onload = () => {
			const bg = document.getElementById('backgroundImage')?.style;
			if (!bg) return;
			bg.backgroundImage = `url(${backgroundImage})`;
			bg.opacity = '1';
		};
	}

	return (
		<ConnectedRouter history={history}>
			{/* <HashRouter>
				<Route
					render={({ location, match }) => {
						return (
							<> */}
			{/* <CurrentDomainProvider> */}
			<Navigator domain={''} />
			{/* </CurrentDomainProvider> */}
			{/* </>
						);
					}}
				/>
			</HashRouter> */}
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
				<ChainSelectorProvider>
					<SubgraphProvider>
						<Web3ReactProvider getLibrary={getLibrary}>
							{/* Our Hooks  */}
							{/* <ZNSDomainsProvider>
								<BidProvider>
									<TransferProvider>
										<StakingRequestProvider>
											<MintProvider>
												<EnlistProvider> */}
							<App />
							{/* </EnlistProvider>
											</MintProvider>
										</StakingRequestProvider>
									</TransferProvider>
								</BidProvider>
							</ZNSDomainsProvider> */}
						</Web3ReactProvider>
					</SubgraphProvider>
				</ChainSelectorProvider>
			</ReduxProvider>
		</CacheBuster>
	);
}

export default wrappedApp;
