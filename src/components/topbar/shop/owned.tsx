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

const Owned: FC = () => {
  const context = useWeb3React<Web3Provider>();

  const contracts = useZnsContracts();
  const { library, account, active, chainId } = context;

  const { owned } = useDomainCache();

  const gridCell = () => {
    return (
      <div className="Cellgrid">
        <div className="Topcell"> </div>
        <div className="Bottomcell">
          <div className="TextTopcell"></div>
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

  if (owned.isNothing()) return <p>User owns no domains.</p>;

  return (
    <>
      <div className="gridContainer-profile">{cells}</div>
      {/* <div>
        {console.log('OWNED ', owned)}
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
      </div> */}
    </>
  );
};

export default Owned;
