import { FC, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useDomainCache } from '../../../lib/useDomainCache';
import { Modal } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import _ from 'lodash';
import './css/nft-view.scss';
import TableImage from '../table/table-image';

interface ProfileProps {
  domain: string;
}

const NFTview: FC<ProfileProps> = ({ domain: _domain }) => {
  const [isNftVisible, setNftVisible] = useState(false);
  const context = useWeb3React<Web3Provider>();
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

  const showNft = () => {
    setNftVisible(true);
  };

  const nftOk = () => {
    setNftVisible(false);
  };

  const nftCancel = () => {
    setNftVisible(false);
  };

  if (domain.isNothing()) return null;
  return (
    <>
      <>
        {domain.isJust() && (
          <button className="btn-" onClick={showNft}>
            <TableImage domain={_domain} />
          </button>
        )}
        <Modal
          className="nft-view-modal"
          visible={isNftVisible}
          onOk={nftOk}
          onCancel={nftCancel}
          footer={null}
          closable={false}
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

          <div className="right-container">
            <h1 className="nft-title">TITLE</h1>
            <div className="creator-title">CREATOR</div>
            <div className="desc-f">DESCRIPTON FORM</div>
            <div className="purch-btn">PURCHACE BUTTON</div>
            <div className="price-time">PRICE 1</div>
            <div className="price-current">PRICE 2</div>
          </div>
          <div className="btm-graph">GRAPH</div>

          {/* <Approve
            domain={_domain}
            outgoingPendingCount={outgoingPendingCount}
            setOutgoingPendingCount={setOutgoingPendingCount}
          /> */}
        </Modal>
      </>
    </>
  );
};
export default NFTview;
