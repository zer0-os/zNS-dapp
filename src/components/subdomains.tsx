import React, { FC } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Link } from 'react-router-dom';
import { useZnsContracts } from '../lib/contracts';
import { useDomainCache } from '../lib/useDomainCache';
import Transfer from './transferDomains';
import Create from './create';

interface SubdomainsProps {
  domain: string;
}

const Subdomains: FC<SubdomainsProps> = ({ domain: _domain }) => {
  const context = useWeb3React<Web3Provider>();
  const contracts = useZnsContracts();
  const { library, account, active, chainId } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
  if (domain.isNothing()) return <p>Loading</p>;
  console.table(domain);
  return (
    <>
      {account?.toLowerCase() === domain.value.owner.toLowerCase() ? (
        <>
          <Create domainId={domain.value.id} domainContext={domainContext} />
          <Transfer domainId={domain.value.id} domainContext={domainContext} />
        </>
      ) : null}
      <Link to={'/' + domain.value.domain.replace(/\./, '/')}>
        Domain: {domain.value.domain}
      </Link>
      <div>
        Children:
        {domain.value.children.map((child) => (
          <div key={child}>
            <Link to={'/' + child.replace(/\./, '/')}>{child}</Link>
          </div>
        ))}
      </div>
      <div>Owner: {domain.value.owner}</div>
    </>
  );
};

export default Subdomains;
