import React, { FC, useMemo, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useZnsContracts } from '../../lib/contracts';
import { useDomainCache } from '../../lib/useDomainCache';
import { useDomainStore } from '../../lib/useDomainStore';
import _ from 'lodash';
import { domain } from 'process';

interface GridProps {
  domain: string;
}

const Grid: FC<GridProps> = ({ domain: _domain }) => {
  const context = useWeb3React<Web3Provider>();
  const contracts = useZnsContracts();
  const { account } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;

  //   const GlobalData = useMemo(
  //     () => (domain.isNothing() ? [] : domain.map((d) => d.children)),
  //     [domain],
  //   );

  //   const LocalData = useMemo(
  //     () => (domain.isNothing() ? [] : _.map((domain.value.children)  => 'div' + domain + 'div'),
  //     [domain],
  //   );

  //   console.log('LIST', GlobalData, LocalData);
  return (
    <div className="domainList">
      {domain.map((domain) => (
        <div key={domain.domain}>
          {domain.domain} {domain.children}
        </div>
      ))}
    </div>
  );
};

export default Grid;
