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
              <div className="profile-img">image</div>
              <div className="profile-des"> description </div>
            </div>
            <div className="footer-container">
              <footer className="profile-clipboard">
                <div className="footer-container">
                  <div className="eth-add">holds eth address</div>
                  <button className="clipboard"> copy </button>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Profile;
