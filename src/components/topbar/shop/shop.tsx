import React, { FC, useState, useCallback } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useZnsContracts } from '../../../lib/contracts';
import { useDomainCache } from '../../../lib/useDomainCache';
import { useDomainStore } from '../../../lib/useDomainStore';
import { Modal, Button } from 'antd';
import Create from '../../table/create';
import Transfer from '../../transferDomains';
import Approve from '../../table/NFT-View/approval';
import { Link, useLocation } from 'react-router-dom';
import _ from 'lodash';
import '../../css/nft-view.scss';
import TableImage from '.././../table/table-image';
interface ProfileProps {
  domain: string;
}

const Shop: FC<ProfileProps> = ({ domain: _domain }) => {
  const [isShopVisible, setShopVisible] = useState(false);
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

  const showShop = () => {
    setShopVisible(true);
  };

  const shopOk = () => {
    setShopVisible(false);
  };

  const shopCancel = () => {
    setShopVisible(false);
  };

  //

  //
  if (domain.isNothing()) return null;
  return (
    <>
      <>
        {domain.isJust() && (
          <button className="btn-" onClick={showShop}>
            <TableImage domain={_domain} />
          </button>
        )}
        <Modal
          className="nft-view-modal"
          visible={isShopVisible}
          onOk={shopOk}
          onCancel={shopCancel}
          footer={null}
        >
          <div className="left-container">
            <div className="nft-img">
              <TableImage domain={_domain} />
            </div>
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
        </Modal>
      </>
    </>
  );
};
export default Shop;
