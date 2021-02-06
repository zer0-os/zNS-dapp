import React, { FC, useState, useMemo, useEffect } from 'react';
import _ from 'lodash';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useDomainCache } from '../lib/useDomainCache';
import { Link, useLocation } from 'react-router-dom';
import Owned from '../components/owned';
import { Layout, Menu, Modal } from 'antd';
import Wallet from '../components/wallet';
import './css/topbar.scss';
import Profile from './profile';
import NFTview from './nft-view';

interface TopbarProps {
  domain: string;
}

const TopbarGlobal: FC<TopbarProps> = ({ domain: _domain }) => {
  const context = useWeb3React<Web3Provider>();
  const { account, active } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
  const location = useLocation();

  const routes = _.transform(
    location.pathname
      .substr(1)
      .split('.')
      .filter((s) => s !== ''),
    (acc: [string, string][], val, i) => {
      let next = 0 < i ? acc[i - 1][1] + '.' + val : val;
      acc.push([val, next]);
    },
  );

  const [connect, setConnect] = useState(false);
  const [isWalletVisible, setWalletVisible] = useState(false);

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
    <div className="topbarContainer">
      <img
        style={{ height: '10%', width: '10%' }}
        src={'ipfs://QmS2G8rZiXVhGYuEPxdeFpYnxwbERh1e538MUfXe9Vghw8'.replace(
          'ipfs://',
          'https://ipfs.io/ipfs/',
        )}
        alt=""
      />
      <div className="route-nav">
        <div className="route-nav-link">
          <Link to={'/'}>Z:/</Link>
        </div>
        {routes.map(([key, path], i) => (
          <div className="route-nav-link">
            <Link to={path}>
              {key}
              {i < routes.length - 1 && '.'}
            </Link>
          </div>
        ))}
      </div>
      {active && (
        <div className="profile-btn">
          <Profile />
        </div>
      )}
      <button className="connect-btn" onClick={showWallet}>
        {' '}
        {active ? 'Connected' : 'Connect Wallet'}{' '}
      </button>
      <Modal visible={isWalletVisible} onOk={walletOk} onCancel={walletCancel}>
        <Wallet />
      </Modal>
    </div>
  );
};

export default TopbarGlobal;
