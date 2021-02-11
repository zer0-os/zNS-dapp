import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import React, { FC, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAsyncDebounce } from 'react-table';
import { useZnsContracts } from '../../lib/contracts';
import { useDomainCache } from '../../lib/useDomainCache';

interface DomainSearchProps {
  domain: string;
}

const SearchDomains: FC<DomainSearchProps> = ({ domain: _domain }) => {
  const context = useWeb3React<Web3Provider>();
  const location = useLocation();
  const contracts = useZnsContracts();
  const { account } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
  const [value, setValue] = useState();
  const [search, setSearch] = useState();
  const [filter, setFilter] = useState([]);

  return (
    <span>
      Search:{' '}
      <input value={value || ''} onChange={(e) => {}} placeholder="search" />
    </span>
  );
};

export default SearchDomains;
