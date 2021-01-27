import React, { useState } from 'react';
import logo from './logo.svg';
import './App.scss';
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import Wallet from './components/wallet';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import Subdomains from './components/subdomains';
import Owned from './components/owned';
import { domainCacheContext, DomainCacheProvider } from './lib/useDomainCache';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { PoweroffOutlined } from '@ant-design/icons';
import { Layout, Menu, Modal } from 'antd';
import Create from './components/create';

const client = new ApolloClient({
  uri: 'http://localhost:8000/subgraphs/name/zer0-os/ZNS-subgraph',
  cache: new InMemoryCache(),
});

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}
function App() {
  const [connect, setConnect] = useState(false);
  const [isWalletVisible, setWalletVisible] = useState(false);
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
  const onClick = () => {
    setConnect(!connect);
  };

  const showWallet = () => {
    setWalletVisible(true);
  };

  const walletOk = () => {
    setWalletVisible(false);
  };

  const walletCancel = () => {
    setWalletVisible(false);
  };
  return (
    <Router>
      <Route
        render={({ location, match }) => (
          <>
            <div className="control-btns-container">
              {active && (
                <div className="profile-btn">
                  <Owned />
                </div>
              )}
              <button
                className="connect-btn"
                style={{ color: 'white' }}
                onClick={showWallet}
              >
                {' '}
                {active ? 'Connected' : 'Connect Wallet'}{' '}
              </button>
              <Modal
                visible={isWalletVisible}
                onOk={walletOk}
                onCancel={walletCancel}
              >
                <Wallet />
              </Modal>
            </div>
            <Switch>
              <Route path="/:id">
                <Subdomains
                  //regex: removes trailing /, then replaces / with .
                  domain={location.pathname
                    .substring(1)
                    .replace(/\/+$/, '')
                    .replace(/\//, '.')}
                />
              </Route>
              <Route path="/">
                {/* <h1>
                  <Subdomains
                    domain={location.pathname
                      .substring(1)
                      .replace(/\/+$/, '')
                      .replace(/\//, '.')}
                  />
                </h1> */}
                {/* TODO: move to styling file */}
                <div
                  style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                  }}
                >
                  <Subdomains domain={'_root'} />
                </div>
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
