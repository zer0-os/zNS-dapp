import './App.scss';
import { useState, useEffect } from 'react';
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import './lib/ipfs';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import Subdomains from './components/table/domainView/child-view';
import { DomainCacheProvider } from './lib/useDomainCache';
import NotificationProvider from './lib/providers/NotificationProvider.js';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import DomainsGlobal from './components/table/domainView/domains-global';
import TopbarGlobal from './components/topbar/topbar/topbar-global';
import Sidebar from './components/table/sidebar/sidebar';
import znsbg from '../src/components/css/video/znsbgslow.mp4';
import Notification from './components/Notification/Notification';
import useNotification from './lib/hooks/useNotification';

const client = new ApolloClient({
  uri: process.env.REACT_APP_SUBGRAPH_URL_42,
  cache: new InMemoryCache(),
});

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}
// This is a comment for a test commit, please remove it

function App() {
  const [isGridView, toggleGridView] = useState(false);

  const { addNotification, removeNotification } = useNotification();
  useEffect(() => {
    setTimeout(() => {
      addNotification('Hi, this is a test notification!');
      setTimeout(() => {
        removeNotification();
        setTimeout(() => {
          addNotification('Thanks for listening!');
          setTimeout(() => removeNotification(), 2000);
        });
      }, 3000);
    }, 2000);
  }, []);

  return (
    <Router>
      <video
        playsInline={true}
        autoPlay={true}
        muted={true}
        loop={true}
        id="bgvid"
      >
        <source src={znsbg} type="video/mp4" />
      </video>
      {/* <Sidebar /> */}
      {/* <div className="sideFadeRight"></div> */}
      <Route
        render={({ location, match }) => (
          <>
            <Notification />
            <Switch>
              <Route path="/:id">
                {/* defaults to the LOCAL NETWORKS page */}
                <TopbarGlobal domain={location.pathname.substring(1)} />
                <Subdomains
                  //regex: removes trailing /, then replaces / with .
                  /*
                  location.pathname
                    .substring(1)
                    .replace(/\/+$/, '')
                    .replace(/\//, '.')
                  */
                  domain={location.pathname.substring(1)}
                  isGridView={isGridView}
                  toggleGridView={toggleGridView}
                />
              </Route>
              <Route path="/">
                <TopbarGlobal
                  domain={
                    // location.pathname.substring(1)
                    // 'domainID'
                    ''
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
                <div>
                  <DomainsGlobal
                    domain={''}
                    isGridView={isGridView}
                    toggleGridView={toggleGridView}
                  />
                </div>
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
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </DomainCacheProvider>
      </Web3ReactProvider>
    </ApolloProvider>
  );
}

export default wrappedApp;
