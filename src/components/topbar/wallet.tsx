import React, { useState } from 'react';
import {
  useWeb3React,
  UnsupportedChainIdError,
} from '@web3-react/core';
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
} from '../../lib/hooks/provider-hooks';
import {
  injected,
  walletconnect,
  walletlink,
  fortmatic,
  // magic,
  portis,
  network,
  // torus,
} from '../../lib/connectors';
import { Spinner } from '../spinner';
import { AbstractConnector } from '@web3-react/abstract-connector';
import '../css/wallet.scss';
import usePrevious from '../../lib/hooks/usePrevious';
import { triggerFocus } from 'antd/lib/input/Input';
// import { METAMASK } from 'web3modal/dist/providers/injected';

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

function ChainId() {
  const { chainId } = useWeb3React();

  return (
    <>
      <span>Chain Id</span>
      <span role="img" aria-label="chain"></span>
      <span>{chainId ?? ''}</span>
    </>
  );
}

function BlockNumber() {
  const { chainId, library } = useWeb3React();

  const [blockNumber, setBlockNumber] = React.useState<number | null>();
  React.useEffect((): any => {
    if (!!library) {
      let stale = false;

      library
        .getBlockNumber()
        .then((blockNumber: number) => {
          if (!stale) {
            setBlockNumber(blockNumber);
          }
        })
        .catch(() => {
          if (!stale) {
            setBlockNumber(null);
          }
        });

      const updateBlockNumber = (blockNumber: number) => {
        setBlockNumber(blockNumber);
      };
      library.on('block', updateBlockNumber);

      return () => {
        stale = true;
        library.removeListener('block', updateBlockNumber);
        setBlockNumber(undefined);
      };
    }
  }, [library, chainId]); // ensures refresh if referential identity of library doesn't change across chainIds

  return (
    <>
      <span>Block Number</span>
      <span role="img" aria-label="numbers"></span>
      <span>{blockNumber === null ? 'Error' : blockNumber ?? ''}</span>
    </>
  );
}

function Account() {
  const { account } = useWeb3React();

  return (
    <>
      <span>Account</span>
      <span role="img" aria-label="robot"></span>
      <span>
        {account === null
          ? '-'
          : account
            ? `${account.substring(0, 6)}...${account.substring(
              account.length - 4,
            )}`
            : ''}
      </span>
    </>
  );
}

function Balance() {
  const { account, library, chainId } = useWeb3React();

  const [balance, setBalance] = React.useState<any>();
  React.useEffect((): any => {
    if (!!account && !!library) {
      let stale = false;

      library
        .getBalance(account)
        .then((balance: any) => {
          if (!stale) {
            setBalance(balance);
          }
        })
        .catch(() => {
          if (!stale) {
            setBalance(null);
          }
        });

      return () => {
        stale = true;
        setBalance(undefined);
      };
    }
  }, [account, library, chainId]); // ensures refresh if referential identity of library doesn't change across chainIds

  return (
    <>
      <span>Balance</span>

      <span>
        {balance === null ? 'Error' : balance ? `Ξ${formatEther(balance)}` : ''}
      </span>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Header() {
  const { active, error } = useWeb3React();

  return (
    <>
      <h4>{active ? '🟢' : error ? '🔴' : '🟠'}</h4>

      <ChainId />
      <BlockNumber />
      <Account />
      <Balance />
    </>
  );
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const showWallet = () => {
    setWalletVisible(true);
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const walletOk = () => {
    setWalletVisible(false);
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const walletCancel = () => {
    setWalletVisible(false);
  };

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isWalletVisible, setWalletVisible] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const activePrevious = usePrevious(active);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const connectorPrevious = usePrevious(connector);
  // React.useEffect(() => {
  //   if (
  //     { isWalletVisible } &&
  //     ((active && !activePrevious) ||
  //       (connector && connector !== connectorPrevious && !error))
  //   ) {
  //     setWalletVisible(false);
  //   }
  // }, [
  //   setWalletVisible,
  //   active,
  //   error,
  //   connector,
  //   isWalletVisible,
  //   activePrevious,
  //   connectorPrevious,
  // ]);

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
      {/* <Modal
        visible={isWalletVisible}
        onOk={walletOk}
        onCancel={walletCancel}
        footer={null}
      > */}
      <h1>Conntect to a wallet</h1> <hr />
      <div className="walletButtonContainer">
        {(_.keys(connectorsByName) as ConnectorNames[]).map((name) => {
          const currentConnector = connectorsByName[name];
          const activating = currentConnector === activatingConnector;
          const connected = currentConnector === connector;
          const disabled =
            !triedEager || !!activatingConnector || connected || !!error;

          return (
            <>
              <button
                className="network-btns"
                disabled={disabled}
                key={name}
                onClick={() => {
                  setActivatingConnector(currentConnector);
                  activate(connectorsByName[name]);
                }}
              >
                {activating && (
                  <Spinner
                    color={'black'}
                    style={{ height: '25%', marginLeft: '-1rem' }}
                  />
                )}
                {name}
              </button>
            </>
          );
        })}
      </div>
      {(active || error) && (
        <div className="button-target">
          <button
            className="network-d-btn"
            style={{ border: 'none', background: 'transparent' }}
            onClick={() => {
              deactivate();
            }}
          >
            Deactivate
          </button>
        </div>
      )}
      {!!error && <h4>{getErrorMessage(error)}</h4>}
      {!!(library && account) &&
        connector === connectorsByName[ConnectorNames.Network] &&
        chainId && (
          <div className="button-target">
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
        <div className="button-target">
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
        <div className="button-target">
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
            <div className="button-target">
              <button
                onClick={() => {
                  (connector as any).changeNetwork(chainId === 1 ? 100 : 1);
                }}
              >
                Switch Networks
              </button>
            </div>
          )}
          <div className="button-target">
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
      <div id="overlay"></div>
      {/* </Modal> */}
    </>
  );
}
