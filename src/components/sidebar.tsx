import React, { FC, useState, useMemo, useEffect } from 'react';
import _ from 'lodash';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useDomainCache } from '../lib/useDomainCache';
import { Link, useLocation } from 'react-router-dom';
import Owned from './topbar/shop/owned';
import { Layout, Menu, Modal } from 'antd';
import Wallet from './topbar/wallet';
import './css/sidebar.scss';
import Profile from './topbar/profile/profile';
import downarrow from './css/img/down-arrow.png';
import nightmoon from './css/img/night-moon-2.png';
import NFTview from './table/NFT-View/nft-view';
import galaxycircle from './css/img/galaxy-small-borderless.svg';
import feed from './css/img/feed.png';
import tv from './css/img/tv-button-borderless.png';
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
        {/* <div className="dotContainer">
          <div className="dot"></div>
          <div className="dot selectedDot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div> */}
        <div className="icons">
          <div className="iconRow">
            <div className="sbimgContainer">
              {' '}
              <img src={tv} alt="" />
            </div>
          </div>
          <div className="iconRow">
            <div className="sbimgContainer">
              {' '}
              <img src={feed} alt="" />
            </div>
          </div>
          {/* <div className="iconRow">
            <div className="sbimgContainer">
              {' '}
              <img src={geopin} alt="" />
            </div>
          </div>
          <div className="iconRow">
            <div className="sbimgContainer">
              {' '}
              <img src={galaxycircle} alt="" />
            </div>
          </div> */}
        </div>
      </div>
      {/* <div className="profile">
        <img src={elon} alt="" className="profilepic" />
        <div className="buttons">
          <button className="wallet"></button>
          <button className="darkmode-toggle"></button>
        </div>
      </div> */}
    </div>
  );
};

export default Sidebar;
