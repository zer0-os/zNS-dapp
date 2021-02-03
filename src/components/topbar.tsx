import React, { FC, useState, useMemo, useEffect } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useDomainCache } from '../lib/useDomainCache';
import Owned from '../components/owned';
import { Layout, Menu, Modal } from 'antd';
import Wallet from '../components/wallet';

interface TopbarProps {
  domain: string;
}

const Topbar: FC<TopbarProps> = ({ domain: _domain }) => {
  const context = useWeb3React<Web3Provider>();
  const { account, active } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;

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
      {active && (
        <div className="profile-btn">
          <Owned />
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

export default Topbar;
