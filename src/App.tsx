import './App.scss';
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import './lib/ipfs';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import Subdomains from './components/table/domainView/child-view';
import { DomainCacheProvider } from './lib/useDomainCache';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import DomainsGlobal from './components/table/domainView/domains-global';
import TopbarGlobal from './components/topbar/topbar/topbar-global';
import Sidebar from './components/table/sidebar/sidebar';
import znsbg from '../src/components/css/video/znsbgslow.mp4';

const client = new ApolloClient({
  uri: process.env.REACT_APP_SUBGRAPH_URL_42,
  cache: new InMemoryCache(),
});

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}
function App() {
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
      <Sidebar />
      {/* <div className="sideFadeRight"></div> */}
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
                <div style={{ position: 'absolute', top: '0' }}>
                  <DomainsGlobal domain={'ROOT'} />
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

const e = 'hello world';
console.log(client, 'hello world');
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
