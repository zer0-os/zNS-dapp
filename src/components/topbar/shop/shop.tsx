import React, { FC, useState, useCallback, useMemo } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useZnsContracts } from '../../../lib/contracts';
import { useDomainCache } from '../../../lib/useDomainCache';
import { useDomainStore } from '../../../lib/useDomainStore';
import { Modal, Button, Tabs } from 'antd';
import Claim from '../shop/claims';
import Create from '../create';
import Transfer from '../../transferDomains';
import Approve from '../../table/NFT-View/approval';
import { Link, useLocation } from 'react-router-dom';
import _ from 'lodash';
import TableImage from '.././../table/table-image';
import '../../css/shop.scss';
import Outgoing from './outGoingApproval';
import { Column, useTable, useFlexLayout, Cell } from 'react-table';
import Owned from './owned';
import Claims from './claims';
import Stakingview from '../stakingModal';

const { TabPane } = Tabs;

interface ShopProps {
  domain: string;
}

const Shop: FC<ShopProps> = ({ domain: _domain }) => {
  const [isShopVisible, setShopVisible] = useState(false);
  const [isTransferVisible, setTransferVisible] = useState(false);
  const [outgoingPendingCount, setOutgoingPendingCount] = useState(0);
  const [size, setSize] = useState();
  const context = useWeb3React<Web3Provider>();
  const contracts = useZnsContracts();
  const { library, account, active, chainId } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
  const { owned, incomingApprovals } = useDomainStore();
  const location = useLocation();
  const [isStakingVisible, setStakingVisible] = useState(false);

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

  const showStaking = () => {
    setStakingVisible(true);
  };

  const stakingOk = () => {
    setStakingVisible(false);
  };

  const stakingCancel = () => {
    setStakingVisible(false);
  };

  const showShop = () => {
    setShopVisible(true);
  };

  const shopOk = () => {
    setShopVisible(false);
  };

  const shopCancel = () => {
    setShopVisible(false);
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

  const allOwned = useMemo(
    () =>
      owned.isNothing()
        ? []
        : owned.value.map((control) => {
            return (
              <div className="TextTopcell" key={control.domain}>
                {control.domain}
              </div>
            );
          }),
    [owned, account],
  );
  const gridCell = () => {
    return (
      <div className="Cellgrid">
        <div className="Bottomcell">
          <div className="TextTopcells">
            {' '}
            {owned.isNothing()
              ? []
              : owned.value.flatMap((control) => {
                  return control.domain;
                })}
          </div>
          <div className="TextMiddlecell">ticker</div>
          <div className="TextBottomcell">
            <span>Left</span>
            <span>
              <button onClick={showTransfer}> Transfer </button>
              <Modal
                visible={isTransferVisible}
                onOk={transferOk}
                onCancel={transferCancel}
                footer={null}
                width={'65vw'}
                closable={false}
              >
                <Approve domain={_domain} />
              </Modal>
            </span>
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
  if (owned.isNothing() && domain.isNothing()) return null;
  return (
    <>
      {owned.isJust() && (
        <button className="btn-shop" onClick={showShop}>
          Shop
        </button>
      )}
      <Modal
        style={{
          position: 'relative',
          margin: 0,
          marginBottom: 0,
          padding: 0,
          background: '#E5E5E5',
        }}
        bodyStyle={{ height: '90vh', background: '#69038D', marginBottom: 0 }}
        closeIcon={null}
        width={'90vw'}
        centered
        visible={isShopVisible}
        onOk={shopOk}
        onCancel={shopCancel}
        footer={null}
        closable={false}
      >
        <Tabs
          defaultActiveKey="1"
          // size={size}
          style={{
            marginBottom: 32,
            overflow: 'auto',
            background: '#69038D',
            height: '75vh',
            border: '2px solid black',
          }}
          tabPosition={'left'}
        >
          <TabPane
            tab="NFTs You Own"
            key="1"
            style={{ overflow: 'auto', height: '80vh' }}
          >
            <div className="gridContainer-profile">{cells}</div>
            {/* <Owned /> */}
            {/* <div>
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
            </div>{' '} */}
          </TabPane>

          <TabPane
            tab="NFTs You've Made"
            key="3"
            style={{ overflow: 'auto', height: '80vh' }}
          >
            <div className="listOut">
              <div className="gridContainer-profile">domains</div>
            </div>
          </TabPane>
          <TabPane
            tab="Offers You've Made"
            key="2"
            style={{ overflow: 'auto', height: '80vh' }}
          >
            <Outgoing />
          </TabPane>
          <TabPane
            tab="Offers Made To You"
            key="4"
            style={{ overflow: 'auto', height: '80vh' }}
          >
            {/* <div>
              <h1>
                Incoming Approvals:{' '}
                {incomingApprovals.isJust()
                  ? incomingApprovals.value.length
                  : 0}{' '}
              </h1>
            </div> */}

            <Claims />
          </TabPane>
        </Tabs>

        <button onClick={showStaking}>Mint NFT</button>

        <Modal
          visible={isStakingVisible}
          onOk={stakingOk}
          onCancel={stakingCancel}
          footer={null}
          closable={false}
        >
          <Stakingview domain={_domain} />
        </Modal>
      </Modal>
    </>
  );
};
export default Shop;
