import React from 'react';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector';
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from '@web3-react/frame-connector';
import { Web3Provider } from '@ethersproject/providers';
import { formatEther } from '@ethersproject/units';
import _ from 'lodash';
import {
  useEagerConnect,
  useInactiveListener,
} from '../../../lib/hooks/provider-hooks';
import {
  injected,
  walletconnect,
  walletlink,
  fortmatic,
  portis,
  network,
} from '../../../lib/connectors';
import { Spinner } from '../../spinner';
import { AbstractConnector } from '@web3-react/abstract-connector';
import './wallet.scss';
import usePrevious from '../../../lib/hooks/usePrevious';

import FutureButton from '../../Buttons/FutureButton/FutureButton.js'

// Wallet images
import coinbaseIcon from './assets/coinbasewallet.svg'
import fortmaticIcon from './assets/fortmatic.svg'
import metamaskIcon from './assets/metamask.svg'
import networkIcon from './assets/network.svg'
import portisIcon from './assets/portis.svg'
import walletConnectIcon from './assets/walletconnect.svg'
import walletLinkIcon from './assets/walletlink.svg'

const imgFromName = (name: string) => {
  switch (name.toLowerCase()) {
    case 'coinbasewallet':
      return coinbaseIcon
    case 'fortmatic':
      return fortmaticIcon
    case 'metamask':
      return metamaskIcon
    case 'network':
      return networkIcon
    case 'portis':
      return portisIcon
    case 'walletconnect':
      return walletConnectIcon
    case 'walletlink':
      return walletLinkIcon
  }
}

enum ConnectorNames {
  MetaMask = 'MetaMask',
  Network = 'Network',
  WalletConnect = 'WalletConnect',
  WalletLink = 'WalletLink',
  // Ledger = 'Ledger',
  // Trezor = 'Trezor',
  // Frame = 'Frame',
  Fortmatic = 'Fortmatic',
  Portis = 'Portis',
  // Network = 'Network',
}

const getConnectorNameFromContext = (n: any) => {
  const url = n.library.connection.url
  const result = Object.keys(ConnectorNames).filter(i => i.toLowerCase() === url.toLowerCase())
  return result.length > -1 ? result[0] : ''
}

const connectorsByName: {
  [connectorName in ConnectorNames]: AbstractConnector;
} = {
  [ConnectorNames.MetaMask]: injected,

  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.WalletLink]: walletlink,
  [ConnectorNames.Network]: network,

  // [ConnectorNames.Ledger]: ledger,
  // [ConnectorNames.Trezor]: trezor,
  // [ConnectorNames.Frame]: frame,
  [ConnectorNames.Fortmatic]: fortmatic,
  [ConnectorNames.Portis]: portis,
};

function getErrorMessage(error: Error) {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.';
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect ||
    error instanceof UserRejectedRequestErrorFrame
  ) {
    return 'Please authorize this website to access your Ethereum account.';
  } else {
    console.error(error);
    return 'An unknown error occurred. Check the console for more details.';
  }
}

export default function Wallet() {
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

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>();
  // const [isWalletVisible, setWalletVisible] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const activePrevious = usePrevious(active);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const connectorPrevious = usePrevious(connector);

  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  return (
    <>
      <div className="wallet-container border-pink-glow">
        <div className="walletButtonContainer">
          {(_.keys(connectorsByName) as ConnectorNames[]).map((name) => {
            const currentConnector = connectorsByName[name];
            const activating = currentConnector === activatingConnector;
            const connected = currentConnector === connector;
            const disabled =
              !triedEager || !!activatingConnector || connected || !!error;
            return (
              <div className="btn-div" key={name}>
                <button
                  className="network-btns"
                  disabled={disabled}
                  onClick={() => {
                    setActivatingConnector(currentConnector);
                    activate(connectorsByName[name]);
                  }}
                >
                  {/* displays spinner while a wallet is clicked and being confirmed by the user */}
                  {/* {activating && (
                    <Spinner
                      color={'black'}
                      style={{ height: '25%', marginLeft: '-1rem' }}
                    />
                  )} */}
                  <div className="name-con">{name}</div>
                  <div
                    style={{
                      backgroundImage: `url(${imgFromName(name)})`,
                    }}
                    className="circle"
                  ></div>
                </button>
              </div>
            );
          })}
        </div>
        {(active || error) && (
          <>
          <hr style={{marginTop: 20, marginBottom: 18}}/>
          <div key="network-button" className="button-target">
            <FutureButton
              glow
              onClick={deactivate}
            >Disconnect { getConnectorNameFromContext(context) }</FutureButton>
          </div>
          </>
        )}
        {!!error && <h4>{getErrorMessage(error)}</h4>}
        {!!(library && account) &&
          connector === connectorsByName[ConnectorNames.Network] &&
          chainId && (
            <div key="switch-network-button" className="button-target">
              <button
                onClick={() => {
                  (connector as any).changeChainId(chainId === 1 ? 4 : 1);
                }}
              >
                Switch Networks
              </button>
            </div>
          )}
        {connector === connectorsByName[ConnectorNames.WalletConnect] && (
          <div key="kill-walletconnect" className="button-target">
            <button
              onClick={() => {
                (connector as any).close();
              }}
            >
              Kill WalletConnect Session
            </button>
          </div>
        )}
        {connector === connectorsByName[ConnectorNames.Fortmatic] && (
          <div key="kill-fortmatic" className="button-target">
            <button
              onClick={() => {
                (connector as any).close();
              }}
            >
              Kill Fortmatic Session
            </button>
          </div>
        )}
        {connector === connectorsByName[ConnectorNames.Portis] && (
          <>
            {chainId !== undefined && (
              <div key="switch-network-button-portis" className="button-target">
                <button
                  onClick={() => {
                    (connector as any).changeNetwork(chainId === 1 ? 100 : 1);
                  }}
                >
                  Switch Networks
                </button>
              </div>
            )}
            <div key="kill-portis" className="button-target">
              <button
                onClick={() => {
                  (connector as any).close();
                }}
              >
                Kill Portis Session
              </button>
            </div>
          </>
        )}
        <hr style={{ marginTop: 18 }} />
        <div className="new-ETH">
          <div className="ETH"> New to Ethereum?</div>
          <a
            className="link"
            href="https://ethereum.org/en/wallets/"
            target="_blank"
          >
            Learn more about wallets
          </a>
        </div>
      </div>
      {/* </Modal> */}
    </>
  );
}
