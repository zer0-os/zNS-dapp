//- Global Stylesheets
import 'styles/reset.css';
import 'styles/main.css';

//- React Imports
import { HashRouter, Route } from 'react-router-dom';

//- Web3 Imports
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

//- Library Imports
import { DomainCacheProvider } from 'lib/useDomainCache';
import NotificationProvider from 'lib/providers/NotificationProvider';
import MintProvider from 'lib/providers/MintProvider';
import EnlistProvider from 'lib/providers/EnlistProvider';
import { ChainSelectorProvider } from 'lib/providers/ChainSelectorProvider';
import { SubgraphProvider } from 'lib/providers/SubgraphProvider';

//- Page Imports
import { ZNS } from 'pages';

// Web3 library to query
function getLibrary(provider: any): Web3Provider {
	const library = new Web3Provider(provider);
	library.pollingInterval = 12000;
	return library;
}

function App() {
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
		<ChainSelectorProvider>
			<SubgraphProvider>
				<NotificationProvider>
					<Web3ReactProvider getLibrary={getLibrary}>
						<MintProvider>
							<EnlistProvider>
								<DomainCacheProvider>
									<App />
								</DomainCacheProvider>
							</EnlistProvider>
						</MintProvider>
					</Web3ReactProvider>
				</NotificationProvider>
			</SubgraphProvider>
		</ChainSelectorProvider>
	);
}

export default wrappedApp;
