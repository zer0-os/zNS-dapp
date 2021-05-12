//- Global Stylesheets
import 'styles/reset.css'
import 'styles/main.css'

//- React Imports
import { HashRouter, Route } from 'react-router-dom';

//- Web3 Imports
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

//- Library Imports
import './lib/ipfs';
import { DomainCacheProvider } from 'lib/useDomainCache';
import NotificationProvider from 'lib/providers/NotificationProvider';

//- Page Imports
import { ZNS } from 'pages'

// Apollo client for making subgraph queries
const client = new ApolloClient({
  uri: process.env.REACT_APP_SUBGRAPH_URL_42,
  cache: new InMemoryCache(),
});

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
    <ApolloProvider client={client}>
      <NotificationProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <DomainCacheProvider>
            <App />
          </DomainCacheProvider>
        </Web3ReactProvider>
      </NotificationProvider>
    </ApolloProvider>
  );
}

export default wrappedApp;
