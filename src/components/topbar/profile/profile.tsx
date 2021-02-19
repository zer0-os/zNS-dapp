import React, { FC, useState, useCallback, useMemo } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useZnsContracts } from '../../../lib/contracts';
import { useDomainCache } from '../../../lib/useDomainCache';
import { useDomainStore } from '../../../lib/useDomainStore';
import { Modal, Button, Tabs, Radio, Space } from 'antd';
import Create from '../../table/create';
import { Link, useLocation } from 'react-router-dom';
import Claim from '../shop/claims';
import Outgoing from '../shop/outGoingApproval';
import _ from 'lodash';
import '../../css/profile.scss';
import { domain } from 'process';
import elon from '../../css/img/elon.jpg';
import '../../css/profile-grid.scss';
import Owned from '../shop/owned';
import TableImage from '../../table/table-image';
const { TabPane } = Tabs;

const Profile: FC = () => {
  const context = useWeb3React<Web3Provider>();
  const [isOwnedVisible, setOwnedVisible] = useState(false);
  const [count, setCount] = useState(0);
  const [size, setSize] = useState();
  const contracts = useZnsContracts();
  const { owned, incomingApprovals } = useDomainStore();
  const location = useLocation();

  const { library, account, active, chainId } = context;

  const showOwner = () => {
    setOwnedVisible(true);
  };

  const ownerOk = () => {
    setOwnedVisible(false);
  };

  const ownerCancel = () => {
    setOwnedVisible(false);
  };

  return (
    <>
      <button className="owned-btn" onClick={showOwner}>
        Profile
      </button>

      <Modal
        visible={isOwnedVisible}
        onOk={ownerOk}
        onCancel={ownerCancel}
        footer={null}
        width="50vw"
        bodyStyle={{ height: '70vh' }}
      >
        <div className="profile-container">
          <div className="bottomTopContainer">
            <div className="header-container">
              <header className="profile-title profile-row">Profile</header>
            </div>

            <div className="profile-center-container">
              <div className="img-container">
                <div className="profile-img">image</div>
                <div className="profile-text">
                  <div className="profile-name">Name</div>
                  <div className="profile-url">0::/etc</div>
                </div>
              </div>
              <div className="des-container">
                <div className="profile-des">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Aliquid ut tempore dolor maiores enim mollitia alias numquam
                  impedit quas ipsa odit laborum aut temporibus veritatis itaque
                  omnis sunt, quos vitae?{' '}
                </div>
              </div>
            </div>

            <div className="footer-container">
              <div className="footer-qr">
                <div className="qr"></div>
              </div>
              <div className="footer-right">
                <div className="ethLogo">Eth</div>
                <div className="footer-text">Your Ethereum Address</div>
                <div className="footer-address">
                  <div>0xh$hfjfej*ne8uwe8vhHA8</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Profile;
