import './App.scss';
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import './lib/ipfs';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import Subdomains from './components/table/child-view';
import { DomainCacheProvider } from './lib/useDomainCache';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import DomainsGlobal from './components/table/domains-global';
import TopbarGlobal from './components/topbar/topbar-global';
import Sidebar from './components/sidebar';

const client = new ApolloClient({
  uri: process.env.REACT_APP_SUBGRAPH_URL_4,
  cache: new InMemoryCache(),
});

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}
function App() {
  const context = useWeb3React<Web3Provider>();
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    connector,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    library,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    chainId,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    account,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    activate,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    deactivate,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    active,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error,
  } = context;

  return (
    <Router>
      <Sidebar />
      <div className="sideFadeRight"></div>
      <Route
        render={({ location, match }) => (
          <>
            <Switch>
              <Route path="/:id">
                {/* defaults to the LOCAL NETWORKS page */}
                <TopbarGlobal
                  domain={
                    // location.pathname.substring(1)
                    'ROOT'
                  }
                />
                <Subdomains
                  //regex: removes trailing /, then replaces / with .
                  /*
                  location.pathname
                    .substring(1)
                    .replace(/\/+$/, '')
                    .replace(/\//, '.')
                  */
                  domain={location.pathname.substring(1)}
                />
              </Route>
              <Route path="/">
                <TopbarGlobal
                  domain={
                    // location.pathname.substring(1)
                    'ROOT'
                  }
                />

                {/* defaults to the GLOBAL NETWORKS page */}
                {/* <h1>
                  <Subdomains
                    domain={location.pathname
                      .substring(1)
                      .replace(/\/+$/, '')
                      .replace(/\//, '.')}
                  />
                </h1> */}
                {/* TODO: move to styling file */}
                <DomainsGlobal domain={'ROOT'} />
                {/* <Subdomains domain={'ROOT'} /> */}
              </Route>
            </Switch>
          </>
        )}
      />
    </Router>
  );
}

function wrappedApp() {
  return (
    <ApolloProvider client={client}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <DomainCacheProvider>
          <App />
        </DomainCacheProvider>
      </Web3ReactProvider>
    </ApolloProvider>
  );
}

export default wrappedApp;
