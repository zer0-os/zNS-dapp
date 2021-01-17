import React, { FC } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Link } from 'react-router-dom';
import { useZnsContracts } from '../lib/contracts';
import { useDomainCache } from '../lib/useDomainCache';
import Create from './create';

interface LaunchProps {
  domain: string;
}

const LaunchToken: FC<LaunchProps> = ({ domain: _domain }) => {
  const context = useWeb3React<Web3Provider>();
  const contracts = useZnsContracts();
  const { library, account, active, chainId } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
  if (domain.isNothing()) return <p>Loading</p>;
  return (
    <div>
      <Create domainId={domain.value.id} domainContext={domainContext} />
    </div>
  );
};
export default LaunchToken;
