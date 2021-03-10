import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { FC, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useZnsContracts } from '../../lib/contracts';
import { useDomainCache } from '../../lib/useDomainCache';

interface DomainSearchProps {
  domain: string;
}

const SearchDomains: FC<DomainSearchProps> = ({ domain: _domain }) => {
  const context = useWeb3React<Web3Provider>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const location = useLocation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const contracts = useZnsContracts();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { account } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { domain } = domainContext;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [value, setValue] = useState();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [search, setSearch] = useState();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filter, setFilter] = useState([]);

  return (
    <span>
      Search:{' '}
      <input value={value || ''} onChange={(e) => { }} placeholder="search" />
    </span>
  );
};

export default SearchDomains;
