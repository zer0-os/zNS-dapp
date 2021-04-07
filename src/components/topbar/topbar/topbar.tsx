import { FC, useState } from 'react';
import _ from 'lodash';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
// import { useDomainCache } from '../../../lib/useDomainCache';
import { Link, useLocation } from 'react-router-dom';
import { Modal } from 'antd';
import Wallet from '../wallet/wallet';
import './css/topbar.scss';
import Profile from '../profile/profile';
import downarrow from './img/down-arrow.png';
import nightmoon from './img/night-moon-2.png';

interface TopbarProps {
  domain: string;
}

const Topbar: FC<TopbarProps> = ({ domain: _domain }) => {
  const context = useWeb3React<Web3Provider>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { active } = context;
  // const { useDomain } = useDomainCache();
  // const domainContext = useDomain(_domain);
  // const { domain } = domainContext;
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
  const showWallet = () => {
    setWalletVisible(true);
  };
  const walletOk = () => {
    setWalletVisible(false);
  };
  const walletCancel = () => {
    setWalletVisible(false);
  };
  // if (domain.isNothing()) return null;
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <div className="topbarLogoContainer">
          {/* <img
            className="topbarLogo"
            src={domain.value.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
            alt="" 
          /> */}
        </div>
        <div className="route-nav">
          <div className="route-nav-link">
            <Link className="route-nav-text" to={'/'}>
              0::/
            </Link>
          </div>
          {routes.map(([key, path], i) => (
            <div className="route-nav-link">
              <Link className="route-nav-text-sub" to={path}>
                {key}
                {i < routes.length - 1 && '.'}
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="search-bar">
        <input className="search-bar-input" type="text" placeholder="Search" />
        <button className="search-bar-button"></button>
      </div>
      <div className="topbarRight">
        {active && (
          <div className="profile-btn">
            <Profile />
          </div>
        )}
        <button className="connect-btn" onClick={showWallet}>
          {' '}
          {active ? 'Connected' : 'Connect Wallet'}{' '}
        </button>
        <button className="create-network">
          Create Networkk
          <img src={downarrow} alt="" />
        </button>
        <img className="nightmoon" src={nightmoon} alt="" />
      </div>

      <Modal visible={isWalletVisible} onOk={walletOk} onCancel={walletCancel}>
        <Wallet />
      </Modal>
    </div>
  );
};

export default Topbar;
