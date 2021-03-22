import { FC, useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useDomainCache } from '../../lib/useDomainCache';
import { Link, useLocation } from 'react-router-dom';
import useScrollPosition from '@react-hook/window-scroll';
import { Modal } from 'antd';
import Wallet from './wallet';
import '../css/topbar-global.scss';
import usePrevious from '../../lib/hooks/usePrevious';
import Profile from './profile/profile';
import Shop from './shop/shop';

interface TopbarProps {
  domain: string;
}

const TopbarGlobal: FC<TopbarProps> = ({ domain: _domain }) => {
  const context = useWeb3React<Web3Provider>();
  const { active, connector, error } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
  const location = useLocation();

  const scrollY = useScrollPosition(60);

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

  const [isWalletVisible, setWalletVisible] = useState<any>(active);

  const [selected, setSelected] = useState('networks');

  const showWallet = useCallback(() => {
    setWalletVisible(true);
  }, []);
  const walletOk = () => {
    setWalletVisible(false);
  };
  const walletCancel = () => {
    setWalletVisible(false);
  };

  const activePrevious = usePrevious(active);
  const connectorPrevious = usePrevious(connector);
  useEffect(() => {
    if (
      { showWallet } &&
      ((active && !activePrevious) ||
        (connector && connector !== connectorPrevious && !error))
    ) {
      setWalletVisible(false);
    }
  }, [
    setWalletVisible,
    active,
    error,
    connector,
    showWallet,
    activePrevious,
    connectorPrevious,
  ]);

  if (domain.isNothing()) return null;
  return (
    <div
      className={`
    topbarContainerNeo
    ${scrollY > 1 && 'topbarBackgroundFade'}
    `}
    >
      <div className="topHalfContainer">
        <div className="topHalf">
          <div className="topLeft">
            <Link to={'/'} className="network">
              0:/ <span className="slash">/</span>
            </Link>
            {routes.length > 0 ? (
              // <div className="routeBox">
              <div className="route">
                {routes.map(([key, path], i) => (
                  <Link key={key} className="route-nav-text-sub" to={path}>
                    {key}
                    {i < routes.length - 1 && '.'}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          <div className="topRight">
            <div className="shop-btn">
              <Shop domain={_domain} />
            </div>
            <div className="search-bar">
              <button className="search-bar-button"></button>
              <div className="search-bar-glow"></div>
              {/* <img src={searchIcon} alt="" className="search-bar-button" /> */}
              <input
                className="search-bar-input"
                type="text"
                placeholder="Search"
              />
            </div>
            <div className="connect-btn" onClick={showWallet}>
              <div className="dot">{active ? '🟢' : '🔵'}</div>
              <div className="btn-text">
                {active ? 'Connected' : 'Connect Wallet'}
              </div>
            </div>
            <div className="profile-btn">
              <div className="profile-btn">
                <Profile />
              </div>
            </div>
            <div className="dotMenu">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>

        <div className="bottomHalf">
          <div
            onClick={() => setSelected('networks')}
            className={selected === 'networks' ? 'selected' : ''}
          >
            Zero Networks
          </div>
          <div
            onClick={() => setSelected('members')}
            className={selected === 'members' ? 'selected' : ''}
          >
            Members
          </div>
          <div
            onClick={() => setSelected('nfts')}
            className={selected === 'nfts' ? 'selected' : ''}
          >
            NFTs
          </div>
          <div
            onClick={() => setSelected('daos')}
            className={selected === 'daos' ? 'selected' : ''}
          >
            DAOs
          </div>
          <div
            onClick={() => setSelected('universes')}
            className={selected === 'universes' ? 'selected' : ''}
          >
            Universes
          </div>
        </div>
      </div>

      {/* <div className="topbarLeft">
        <Link className="" to={'/'}>
          <img
            className="topbarLogo"
            src={'ipfs://QmS2G8rZiXVhGYuEPxdeFpYnxwbERh1e538MUfXe9Vghw8'.replace(
              'ipfs://',
              'https://ipfs.io/ipfs/',
            )}
            alt=""
          />
        </Link>

        <div className="route-nav">
          <div className="route-nav-link">
            <Link className="route-nav-text" to={'/'}>
              0::/
            </Link>
          </div>
          {routes.length > 0 ? (
            <div className="route-nav-link">
              <Link className="route-nav-text-sub" to={`/${routes[0][0]}`}>
                {routes[0][0]}
              </Link>
            </div>
          ) : null}
        </div>
        <div></div>
      </div>
      <div className="search-bar">
        <input className="search-bar-input" type="text" placeholder="Search" />
        <button className="search-bar-button"></button>
      </div>
      <div className="topbarRight">
        <div className="shop-btn">
          <Shop domain={_domain} />
        </div>

        <button className="connect-btn" onClick={showWallet}>
          {' '}
          {active ? 'Connected 🟢' : 'Connect 🔴'}{' '}
        </button>
        <button
          className="create-network"
          onClick={active ? showStaking : showWallet}
        >
          <span style={{ width: '20px' }}></span>
          MINT NFT
          <span style={{ width: '16px' }}></span>
          <span style={{ width: '16px' }}></span>
        </button>
        <div style={{ width: '50px' }}>
          {active ? (
            <div className="profile-btn">
              <Profile />
            </div>
          ) : null}
        </div>

      </div>

      <Modal
        visible={isStakingVisible}
        onOk={stakingOk}
        onCancel={stakingCancel}
        footer={null}
        width={'65vw'}
        bodyStyle={{}}
        closable={false}
        className="noModalPadding"
      >
        <Stakingview domain={_domain} />
      </Modal>

      <Modal
        visible={isWalletVisible}
        onOk={walletOk}
        onCancel={walletCancel}
        footer={null}
      >
        <Wallet />
        <hr />
        <div className="new-ETH">
          <div className="ETH"> New to Ethereum?</div>{' '}
          <a href="https://ethereum.org/en/wallets/">
            Learn more about wallets
          </a>
        </div>
      </Modal> */}

      <Modal
        visible={isWalletVisible}
        onOk={walletOk}
        onCancel={walletCancel}
        footer={null}
        bodyStyle={{
          height: '464px',
          // width: '385px',
          padding: '0',
          margin: '0',
        }}
        width="385px"
        style={{
          position: 'relative',
          height: '464px',
        }}
      >
        <Wallet />
      </Modal>
    </div>
  );
};

export default TopbarGlobal;
