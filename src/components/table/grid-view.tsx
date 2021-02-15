import React, { FC, useMemo } from 'react';
import '../css/grid.scss';
import { useWeb3React } from '@web3-react/core';
import { useZnsContracts } from '../../lib/contracts';
import { useDomainCache } from '../../lib/useDomainCache';
import { Web3Provider } from '@ethersproject/providers';

interface GridProps {
  domain: string;
}

const gridCell = () => {
  return (
    <div className="gridCell">
      <div className="cellTop"></div>
      <div className="cellBottom">
        <div className="cellTextTop">NFT Name</div>
        <div className="cellTextMiddle">ticker</div>
        <div className="cellTextBottom">
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

const Grid: FC<GridProps> = ({ domain: _domain }) => {
  const context = useWeb3React<Web3Provider>();
  const { account } = context;
  const contracts = useZnsContracts();
  const domainStore = useDomainCache();
  const { useAllDomains, useDomain } = domainStore;
  const { domain, refetchDomain } = useDomain(_domain);

  console.log({ domain });

  return <div className="gridContainer">{cells}</div>;
};

export default Grid;
