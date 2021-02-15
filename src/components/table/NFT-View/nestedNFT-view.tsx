import React, { FC, useState, useCallback } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useZnsContracts } from '../../../lib/contracts';
import { useDomainCache } from '../../../lib/useDomainCache';
import { useDomainStore } from '../../../lib/useDomainStore';
import { Modal, Button } from 'antd';
import Create from '../create';
import Transfer from '../../transferDomains';
import Approve from './approval';
import { Link, useLocation } from 'react-router-dom';
import _ from 'lodash';
import '../../css/subdomains.scss';
import TableImage from '../table-image';
interface NestedProps {
  domain: string;
}

const Nestedview: FC<NestedProps> = ({ domain: _domain }) => {
  const [isSubdomainVisible, setSubdomainVisible] = useState(false);
  const [isTransferVisible, setTransferVisible] = useState(false);
  const [isProfileVisible, setProfileVisible] = useState(true);
  const context = useWeb3React<Web3Provider>();
  const contracts = useZnsContracts();
  const { library, account, active, chainId } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
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

  const { owned, incomingApprovals } = useDomainStore();

  const [outgoingPendingCount, setOutgoingPendingCount] = useState(0);

  const showSubdomain = () => {
    setSubdomainVisible(true);
  };

  const subdomainOk = () => {
    setSubdomainVisible(false);
  };

  const subdomainCancel = () => {
    setSubdomainVisible(false);
  };

  const showTransfer = () => {
    setTransferVisible(true);
  };

  const transferOk = () => {
    setTransferVisible(false);
  };

  const transferCancel = () => {
    setTransferVisible(false);
  };

  const showProfile = () => {
    setProfileVisible(true);
  };

  const profileOk = () => {
    setProfileVisible(false);
  };

  const profileCancel = () => {
    setProfileVisible(false);
  };

  //

  //
  if (domain.isNothing()) return null;
  return (
    <>
      <>
        {domain.isJust() && (
          <button className="nft-btn" onClick={showProfile}>
            <TableImage domain={_domain} />
          </button>
        )}
        <Modal
          style={{
            position: 'relative',
            margin: 0,
            padding: 0,
            border: '2px solid red',
          }}
          bodyStyle={{ height: '80vh' }}
          closeIcon={null}
          centered
          width={'80vw'}
          visible={isProfileVisible}
          onOk={profileOk}
          onCancel={profileCancel}
          footer={null}
        >
          <div className="nftviewContainer">
            <div className="leftRightContainer">
              <div className="left-container">
                <div className="nft-img">
                  <TableImage domain={_domain} />
                </div>
                <div className="nftImageInfo">
                  <div className="eth-address-d">
                    <div>ETH</div> {domain.value.controller}
                  </div>

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
              </div>

              <div className="right-container">
                <h1 className="nft-title">TITLE</h1>
                <div className="creator-title">CREATOR</div>
                <div className="desc-f">DESCRIPTON FORM</div>
                <div className="purch-btn">PURCHACE BUTTON</div>
                <div className="price-time">PRICE 1</div>
                <div className="price-current">PRICE 2</div>
                <div className="btm-graph">GRAPH</div>
              </div>
            </div>
          </div>

          {/* 
          <Approve
            domain={_domain}
            outgoingPendingCount={outgoingPendingCount}
            setOutgoingPendingCount={setOutgoingPendingCount}
          /> */}
        </Modal>
      </>
    </>
  );
};
export default Nestedview;
