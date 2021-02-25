import React, { FC, useState, useCallback } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useZnsContracts } from '../../../lib/contracts';
import { useDomainCache } from '../../../lib/useDomainCache';
import { useDomainStore } from '../../../lib/useDomainStore';
import { Modal, Button } from 'antd';
import Create from '../../topbar/create';
import Transfer from '../../transferDomains';
import Approve from './approval';
import { Link, useLocation } from 'react-router-dom';
import _ from 'lodash';
import '../../css/subdomains.scss';
import TableImage from '../table-image';
import NFTImage from './nft-image';
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
  const [graphButton, setGraphButton] = useState('performance');

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
            // border: '2px solid red',
          }}
          bodyStyle={{ height: '80vh' }}
          closeIcon={null}
          centered
          width={'80vw'}
          visible={isProfileVisible}
          onOk={profileOk}
          onCancel={profileCancel}
          footer={null}
          closable={false}
        >
          <div className="nftviewContainer">
            <div className="leftRightContainer">
              <div className="left-container">
                <div className="nft-img">
                  <NFTImage domain={_domain} />
                  <div className="nftImageInfo">
                    <div className="eth-address-d nftInfoRow">
                      <span className="nftDomain">
                        <span className="grayNFTText">
                          {domain.value.controller.slice(0, 2)}
                        </span>
                        {domain.value.controller.slice(2)}
                      </span>
                    </div>

                    <div className="route-nav nftInfoRow">
                      <div className="route-nav-preface">
                        <Link className="route-nav-0" to={'/'}>
                          0::/
                        </Link>
                      </div>
                      <div className="link-text-container">
                        {routes.map(([key, path], i) => (
                          <span className="route-nav-link">
                            <Link className="route-nav-text-sub" to={path}>
                              {key}
                              {i < routes.length - 1 && '.'}
                            </Link>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="right-container">
                <div className="rightTop">
                  <div className="namebar">
                    <div className="artistIMG">img</div>
                    <div className="title">
                      <div className="nftName">
                        <div>NFT Name</div>
                      </div>
                      <div className="type">
                        <div>NFT</div>
                      </div>
                    </div>
                    <div className="artistName"></div>
                  </div>
                  <div className="infobar">
                    <div className="description">
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                      Perferendis, vel non. Praesentium explicabo assumenda
                      distinctio quidem. Quasi neque culpa dolor.
                    </div>
                    <div className="infoRight">
                      {/* <div className="headers">
                        <div>Last Price</div>
                        <div>% Change</div>
                      </div>
                      <div className="numbers">
                        <div className="lastPriceText">$101.33</div>
                        <div className="changeText">+36.09%</div>
                      </div> */}
                      <div className="info">
                        <div className="lastprice">
                          <div>Last Price</div>
                          <div className="lastPriceText">$101.33</div>
                        </div>
                        <div className="change">
                          <div>% Change</div>
                          <div className="changeText">+36.09%</div>
                        </div>
                      </div>
                      <div className="purchase">Purchase</div>
                    </div>
                  </div>
                </div>

                {/* <div className="rightTopNFT">
                  <div className="rightTopNFTLeft">
                    <div className="title">
                      <div className="nftName">Name</div>
                      <div className="nftType">Totem</div>
                    </div>
                    <div className="artistInfo">
                      <div className="artistIMG">img</div>
                      <div className="artist">
                        <span className="by">by</span> Artist
                      </div>
                    </div>
                  </div>
                  <div className="rightTopNFTRight">
                    <div className="lastprice">
                      <div>Last Price</div>
                      <div className="lastPriceText">$101.33</div>
                    </div>
                    <div className="change">
                      <div>% Change</div>
                      <div className="changeText">+36.09%</div>
                    </div>
                    <div className="purchase">Purchase</div>
                  </div>
                </div> */}
                {/* <div className="rightMiddleNFT">
                  <div className="descriptionTitle">DESCRIPTION</div>
                  <div className="description">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Error cumque reprehenderit nobis sint vel temporibus
                    praesentium, provident perspiciatis nihil harum quidem
                    molestiae saepe recusandae aut ad quaerat illo ut ipsa.
                  </div>
                  <div className="readmore">Read More</div>
                </div> */}
                <div className="graphContainer">
                  <div className="rightGraphBarNFT">
                    <div className="leftAlign">
                      <div
                        onClick={() => setGraphButton('performance')}
                        className={`${
                          graphButton === 'performance' ? 'selectedItem' : null
                        }`}
                      >
                        Performance
                      </div>
                      <div
                        onClick={() => setGraphButton('collectors')}
                        className={`${
                          graphButton === 'collectors' ? 'selectedItem' : null
                        }`}
                      >
                        Collectors
                      </div>
                      <div
                        onClick={() => setGraphButton('price')}
                        className={`${
                          graphButton === 'price' ? 'selectedItem' : null
                        }`}
                      >
                        Price History
                      </div>
                      <div
                        onClick={() => setGraphButton('tx')}
                        className={`${
                          graphButton === 'tx' ? 'selectedItem' : null
                        }`}
                      >
                        Tx History
                      </div>
                    </div>
                    {/* <div
                    onClick={() => setGraphButton('comments')}
                    className={`rightAlign ${
                      graphButton === 'comments' ? 'selectedItem' : null
                    }`}
                  >
                    <span className="numComments">33</span>
                    <span className="comments">Comments</span>
                  </div> */}
                  </div>
                  <div className="rightGraphNFT">
                    <div className="graph"></div>
                  </div>
                </div>
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
