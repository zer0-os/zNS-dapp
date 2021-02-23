import React, { FC, useCallback, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Modal, Button } from 'antd';
import { useZnsContracts } from '../../../lib/contracts';
import {
  domainCacheContext,
  useDomainCache,
} from '../../../lib/useDomainCache';
import { domain } from 'process';
import Approve from '../../table/NFT-View/approval';

const Owned: FC = () => {
  const context = useWeb3React<Web3Provider>();

  const contracts = useZnsContracts();
  const { library, account, active, chainId } = context;

  const { owned } = useDomainCache();

  const gridCell = () => {
    return (
      <div className="gridCell">
        <div className="topCell">
          <div className="cellImage"></div>
        </div>
        <div className="bottomCell">
          <div className="name"></div>
          <div className="domain"></div>
          <div className="desc">
            <div className="ticker">XYZ</div>
            <div className="holders">X Holdes</div>
          </div>
          <div className="price">$1234.00</div>
          <div className="bottom">
            <span className="eth-price">(Eth price)</span>
            <span className="cell-btn">
              <button> transfer Modal</button>
            </span>
          </div>
        </div>
      </div>
    );
  };

  const ownedCells: any = [];

  // if (owned.isJust()) {
  //   owned.value.map((own) => {
  //     push(ownedCells);
  //   });
  // }

  // console.log('all owned', ownedCells);
  const cells: any = [];
  cells.push(gridCell());
  cells.push(gridCell());
  cells.push(gridCell());
  cells.push(gridCell());
  cells.push(gridCell());
  cells.push(gridCell());
  cells.push(gridCell());
  cells.push(gridCell());

  if (owned.isNothing()) return <p>User owns no domains.</p>;

  return (
    <>
      <div className="gridContainer-profile">{cells}</div>
    </>
  );
};

export default Owned;
