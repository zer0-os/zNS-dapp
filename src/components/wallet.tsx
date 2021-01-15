import React, { useState } from 'react';
import PowerSettingsNewRoundedIcon from '@material-ui/icons/PowerSettingsNewRounded';
import {
  Web3ReactProvider,
  useWeb3React,
  UnsupportedChainIdError,
} from '@web3-react/core';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Paper from '@material-ui/core/Paper';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector';
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from '@web3-react/frame-connector';
import { Web3Provider } from '@ethersproject/providers';
import { formatEther } from '@ethersproject/units';
import _ from 'lodash';
import { useEagerConnect, useInactiveListener } from '../lib/provider-hooks';
import {
  injected,
  network,
  walletconnect,
  walletlink,
  ledger,
  trezor,
  frame,
  authereum,
  fortmatic,
  magic,
  portis,
  torus,
} from '../lib/connectors';
import { Spinner } from './spinner';
import { AbstractConnector } from '@web3-react/abstract-connector';
import './css/wallet.scss';

enum ConnectorNames {
  Injected = 'Injected',
  Network = 'Network',
  WalletConnect = 'WalletConnect',
  WalletLink = 'WalletLink',
  Ledger = 'Ledger',
  Trezor = 'Trezor',
  Frame = 'Frame',
  Authereum = 'Authereum',
  Fortmatic = 'Fortmatic',
  Magic = 'Magic',
  Portis = 'Portis',
  Torus = 'Torus',
}

const connectorsByName: {
  [connectorName in ConnectorNames]: AbstractConnector;
} = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.Network]: network,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.WalletLink]: walletlink,
  [ConnectorNames.Ledger]: ledger,
  [ConnectorNames.Trezor]: trezor,
  [ConnectorNames.Frame]: frame,
  [ConnectorNames.Authereum]: authereum,
  [ConnectorNames.Fortmatic]: fortmatic,
  [ConnectorNames.Magic]: magic,
  [ConnectorNames.Portis]: portis,
  [ConnectorNames.Torus]: torus,
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

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>();
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
      <Grid className="modal" id="modal">
        <div className="modal-header"> Connect Wallet</div>
        <div className="menu">
          {(_.keys(connectorsByName) as ConnectorNames[]).map((name) => {
            const currentConnector = connectorsByName[name];
            const activating = currentConnector === activatingConnector;
            const connected = currentConnector === connector;
            const disabled =
              !triedEager || !!activatingConnector || connected || !!error;

            return (
              <div className="button-grid">
                <div className="test">
                  <Grid item>
                    <Button
                      className="networkButtons"
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
                    </Button>
                  </Grid>
                </div>
              </div>
            );
          })}

          {(active || error) && (
            <div className="button-target">
              <Button
                onClick={() => {
                  deactivate();
                }}
              >
                Deactivate
              </Button>
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
          {connector === connectorsByName[ConnectorNames.WalletLink] && (
            <div className="button-target">
              <button
                onClick={() => {
                  (connector as any).close();
                }}
              >
                Kill WalletLink Session
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
          {connector === connectorsByName[ConnectorNames.Magic] && (
            <div className="button-target">
              <button
                onClick={() => {
                  (connector as any).close();
                }}
              >
                Kill Magic Session
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
          {connector === connectorsByName[ConnectorNames.Torus] && (
            <div className="button-target">
              <button
                onClick={() => {
                  (connector as any).close();
                }}
              >
                Kill Torus Session
              </button>
            </div>
          )}
        </div>
      </Grid>
      <div id="overlay"></div>
    </>
  );
}
