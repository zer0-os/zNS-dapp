import React, { useState } from 'react';
import logo from './logo.svg';
import './App.scss';
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import './lib/ipfs';
import Wallet from './components/wallet';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import Subdomains from './components/child-view';
import Owned from './components/owned';
import { domainCacheContext, DomainCacheProvider } from './lib/useDomainCache';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { PoweroffOutlined } from '@ant-design/icons';
import { Layout, Menu, Modal } from 'antd';
import Create from './components/create';
import Topbar from './components/topbar';
import DomainsGlobal from './components/domains-global';
import TopbarGlobal from './components/topbar-global';
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
    connector,
    library,
    chainId,
    account,
    activate,
    deactivate,
    active,
    error,
  } = context;

  return (
    <Router>
      <Sidebar />
      <Route
        render={({ location, match }) => (
          <>
            <Switch>
              <Route path="/:id">
                {/* defaults to the LOCAL NETWORKS page */}
                <Topbar domain={location.pathname.substring(1)} />
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
                <TopbarGlobal domain={location.pathname.substring(1)} />

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
