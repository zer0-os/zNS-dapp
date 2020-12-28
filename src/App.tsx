import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import Wallet from "./components/wallet";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import Domains from "./components/domains";
import { DomainCacheProvider } from "./lib/useDomainCache";

const client = new ApolloClient({
  uri: "http://localhost:8000/subgraphs/name/zer0-os/ZNS-subgraph",
  cache: new InMemoryCache(),
});

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}
function App() {
  const [connect, setConnect] = useState(false);
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
  return (
    <>
      <button onClick={onClick}>{connect ? "Close" : "Connect wallet"}</button>
      {connect && <Wallet />}
      <Domains />
    </>
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
