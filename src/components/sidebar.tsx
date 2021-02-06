import React, { FC, useState, useMemo, useEffect } from 'react';
import _ from 'lodash';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useDomainCache } from '../lib/useDomainCache';
import { Link, useLocation } from 'react-router-dom';
import Owned from '../components/owned';
import { Layout, Menu, Modal } from 'antd';
import Wallet from '../components/wallet';
import './css/sidebar.scss';
import Profile from './profile';
import downarrow from './css/img/down-arrow.png';
import nightmoon from './css/img/night-moon-2.png';
import NFTview from './nft-view';
import galaxycircle from './css/img/galaxy-circle.png';
import feed from './css/img/feed.png';
import tv from './css/img/tv-button.png';
import geopin from './css/img/geo-pin.png';
import elon from './css/img/elon.jpg';

const Sidebar: FC = () => {
  const context = useWeb3React<Web3Provider>();
  const { account, active } = context;
  const { useDomain } = useDomainCache();
  //   const domainContext = useDomain(_domain);
  //   const { domain } = domainContext;
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
    <div className="sidebarContainer">
      <div className="sidebarNav">
        {/* <ul className="dots">
          <li></li>
          <li className="selected"></li>
          <li></li>
          <li></li>
        </ul> */}
        <ul className="icons">
          <li>
            <img src={tv} alt="" />
          </li>
          <li>
            <img src={feed} alt="" />
          </li>
          <li>
            {' '}
            <img src={geopin} alt="" />
          </li>
          <li>
            <img src={galaxycircle} alt="" />
          </li>
        </ul>
      </div>
      <div className="profile">
        <img src={elon} alt="" className="profilepic" />
        <div className="buttons">
          <button className="wallet"></button>
          <button className="darkmode-toggle"></button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
