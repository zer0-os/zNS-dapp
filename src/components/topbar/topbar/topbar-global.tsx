import { FC, useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
// import { useDomainCache } from '../../../lib/useDomainCache';
import { Link, useLocation } from 'react-router-dom';
import useScrollPosition from '@react-hook/window-scroll';
import { Modal } from 'antd';
import Wallet from '../wallet/wallet';
import './css/topbar-global.scss';
import usePrevious from '../../../lib/hooks/usePrevious';
import Profile from '../profile/profile';
import Shop from '../shop/shop';
import { useDomainCache } from '../../../lib/useDomainCache';
import Owned from '../shop/owned';

// New
import FutureButton from '../../Buttons/FutureButton/FutureButton.js';
import MintNewNFT from '../../MintNewNFT/MintNewNFT';
import ProfileNew from '../../Profile/Profile.js';
import { any } from 'zod';

interface TopbarProps {
  name: string;
}

var lastY = 0 // Just a global variable to stash last scroll position

const TopbarGlobal: FC<TopbarProps> = ({ name: _domain }) => {
  const context = useWeb3React<Web3Provider>();
  const { active, connector, error } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { name } = domainContext;
  const location = useLocation();

  // Hide header on scroll
  const [hideHeader, setHideHeader] = useState(false)
  const handleScroll = () => {
    const hide = window.pageYOffset > 100 && window.pageYOffset > lastY
    lastY = window.pageYOffset
    setHideHeader(hide)
  }
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [ hideHeader, handleScroll ])

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

  const [selected, setSelected] = useState('networks');

  // Profile modal handling
  const [ isProfileVisible, setProfileVisible ] = useState(false)
  const openProfile = () => setProfileVisible(true)
  const closeProfile = () => setProfileVisible(false)

  // Mint modal handling
  const showMint = useCallback(() => {
    setMintVisible(true);
  }, []);
  const [isMintVisible, setMintVisible] = useState(false);
  const mintOk = () => setMintVisible(false)
  const mintCancel = () => setMintVisible(false)

  // Wallet modal handling
  const [isWalletVisible, setWalletVisible] = useState<any>(active);
  const showWallet = useCallback(() => {
    setWalletVisible(true);
  }, []);
  const walletOk = () => setWalletVisible(false)
  const walletCancel = () => setWalletVisible(false)
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

  if (name.isNothing()) return null;

  return (
    <div
      className={`topbarContainerNeo`}
    >
      <div className={`topHalfContainer ${hideHeader ? 'hidden' : ''}`}>
        <div className="topHalf border-primary">
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
            {!active ? (
              <FutureButton glow onClick={showWallet}>Connect Wallet</FutureButton>
            ) : (
              <>
                <FutureButton glow onClick={showMint}>
                  Mint New NFT
                </FutureButton>
                <div onClick={openProfile} className="profile-btn">
                  <div className="profile-btn">
                    <Profile
                    />
                  </div>
                </div>
                <div className="dotMenu" onClick={showWallet}>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bottomHalf">
          <div
            onClick={() => setSelected('networks')}
            className={selected === 'networks' ? 'selected' : ''}
          >
            New Drop
          </div>
          <div
            onClick={() => setSelected('members')}
            className={selected === 'members' ? 'selected' : ''}
          ></div>
          <div
            onClick={() => setSelected('nfts')}
            className={selected === 'nfts' ? 'selected' : ''}
          ></div>
          <div
            onClick={() => setSelected('daos')}
            className={selected === 'daos' ? 'selected' : ''}
          ></div>
          <div
            onClick={() => setSelected('universes')}
            className={selected === 'universes' ? 'selected' : ''}
          ></div>
        </div>
      </div>

      <Modal
        visible={isMintVisible}
        onOk={mintOk}
        closable={false}
        centered
        onCancel={mintCancel}
        footer={null}
        width={640}
      >
        <MintNewNFT name={''} props={{onMint: mintCancel, onCancel: mintCancel}}></MintNewNFT>
      </Modal>

      <Modal
        centered
        visible={isProfileVisible}
        onCancel={closeProfile}
        closable={false}
        footer={null}
        style={{top: 27}}
        width={1320}
      >
        <ProfileNew
        />
      </Modal>

      <Modal
        centered
        visible={isWalletVisible}
        onOk={walletOk}
        onCancel={walletCancel}
        closable={false}
        footer={null}
        width={304}
      >
        <Wallet />
      </Modal>
    </div>
  );
};

export default TopbarGlobal;
