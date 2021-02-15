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

  // const _gridData = () => {
  //   {if (owned.isJust())owned.value.map((control) => {
  //       return (

  //           <Link to={'/' + control.domain}>
  //             {control.domain}
  //           </Link>
  //       )}}}
  // const ownedAll = useMemo(()=>
  // {if (owned.isJust())owned.value.map((control) => {
  //   return (
  //     <div key={control.domain}>
  //       <Link
  //         to={'/' + control.domain}
  //       >
  //         {control.domain}
  //       </Link>
  //   </div> )}},[owned])

  const gridCell = () => {
    return (
      <div className="Cellgrid">
        <div className="Topcell">
          {' '}
          <img src={elon} alt="" className="profilepic" />
        </div>
        <div className="Bottomcell">
          <div className="TextTopcell">
            <Owned />
          </div>
          <div className="TextMiddlecell">ticker</div>
          <div className="TextBottomcell">
            <span>Left</span>
            <span>Right</span>
          </div>
        </div>
      </div>
    );
  };

  const cells: any = [];
  cells.push(gridCell());
  cells.push(gridCell());
  cells.push(gridCell());
  cells.push(gridCell());
  cells.push(gridCell());
  cells.push(gridCell());
  cells.push(gridCell());
  cells.push(gridCell());
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
                <div className="ZNA">ZNS</div>
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

        {console.log('OWNED ', owned)}
      </Modal>
    </>
  );
};

export default Profile;
