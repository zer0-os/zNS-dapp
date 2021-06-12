//- Global Stylesheets
import 'styles/reset.css';
import 'styles/main.css';

//- React Imports
import { HashRouter, Route } from 'react-router-dom';

//- Web3 Imports
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

//- Library Imports
import { DomainCacheProvider } from 'lib/useDomainCache';
import NotificationProvider from 'lib/providers/NotificationProvider';
import MintProvider from 'lib/providers/MintProvider';
import EnlistProvider from 'lib/providers/EnlistProvider';
import MvpVersionProvider from 'lib/providers/MvpVersionProvider';
import { ChainSelectorProvider } from 'lib/providers/ChainSelectorProvider';
import { SubgraphProvider } from 'lib/providers/SubgraphProvider';

//- Asset Imports
import backgroundImage from 'assets/zns-bg.png';

//- Page Imports
import { ZNS } from 'pages';
import React from 'react';
import StakingRequestProvider from 'lib/providers/StakingRequestProvider';

// Web3 library to query
function getLibrary(provider: any): Web3Provider {
	const library = new Web3Provider(provider);
	library.pollingInterval = 12000;
	return library;
}

function App() {
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
		<HashRouter>
			<Route
				render={({ location, match }) => (
					<>
						<ZNS domain={location.pathname} />
					</>
				)}
			/>
		</HashRouter>
	);
}

function wrappedApp() {
	return (
		// Web3 Library Hooks
		<ChainSelectorProvider>
			<SubgraphProvider>
				<NotificationProvider>
					<Web3ReactProvider getLibrary={getLibrary}>
						{/* Our Hooks */}
						<MvpVersionProvider>
							<StakingRequestProvider>
								<MintProvider>
									<EnlistProvider>
										<DomainCacheProvider>
											<App />
										</DomainCacheProvider>
									</EnlistProvider>
								</MintProvider>
							</StakingRequestProvider>
						</MvpVersionProvider>
					</Web3ReactProvider>
				</NotificationProvider>
			</SubgraphProvider>
		</ChainSelectorProvider>
	);
}

export default wrappedApp;
