import React, { FC, useState, useCallback } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useZnsContracts } from '../../../lib/contracts';
import { useDomainCache } from '../../../lib/useDomainCache';
import { useDomainStore } from '../../../lib/useDomainStore';
import { Modal, Button, Tabs, Radio, Space } from 'antd';
import Create from '../../table/create';
import { Link, useLocation } from 'react-router-dom';
import Claim from './claims';
import Outgoing from './outGoingApproval';
import _ from 'lodash';
import '../../css/profile.scss';
import { domain } from 'process';
import elon from '../../css/img/elon.jpg';
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

  const outgoingApprovals = owned.isJust()
    ? owned.value.filter((control) => {
        return control.approval.isJust();
      })
    : null;

  console.log(outgoingApprovals);
  console.log(outgoingApprovals?.length, 'MANYAPPROVALS');

  const [outgoingPendingCount, setOutgoingPendingCount] = useState(0);

  const showOwner = () => {
    setOwnedVisible(true);
  };

  const ownerOk = () => {
    setOwnedVisible(false);
  };

  const ownerCancel = () => {
    setOwnedVisible(false);
  };

  if (owned.isNothing()) return null;
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
      >
        <div className="profile-container">
          <div className="profile-left">
            <div>
              {' '}
              <img src={elon} alt="" className="profilepic" />{' '}
            </div>
            <div className="profile-name">Elon Musk</div>
            <div className="route-nav">
              <div className="route-nav-link">
                <div>ZNS</div>
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

          <div className="profile-middle">
            <h1 className="profile-title">Profile</h1>
            <p>Description</p>
          </div>
        </div>

        <Tabs defaultActiveKey="1" size={size} style={{ marginBottom: 32 }}>
          <TabPane tab="Claims" key="1">
            <div>
              <h1>
                Incoming Approvals:{' '}
                {incomingApprovals.isJust()
                  ? incomingApprovals.value.length
                  : 0}{' '}
              </h1>
            </div>

            <div>
              <Claim />
            </div>
          </TabPane>
          <TabPane tab=" Outgoing Approvals" key="2">
            <div className="listOut">
              <div>
                <h1>
                  Outgoing Approvals:
                  {outgoingApprovals ? outgoingApprovals.length : 0}{' '}
                </h1>
              </div>

              <Outgoing />
            </div>
          </TabPane>
          <TabPane tab="Domains you own" key="3">
            <div>
              {owned.value.map((control) => {
                return (
                  <div key={control.domain}>
                    <Link
                      to={'/' + control.domain}
                      //   key={control.domain}
                    >
                      {control.domain}
                    </Link>
                  </div>
                );
              })}
            </div>{' '}
          </TabPane>
        </Tabs>

        {console.log('OWNED ', owned)}
      </Modal>
    </>
  );
};

export default Profile;
