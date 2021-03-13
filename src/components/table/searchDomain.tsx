import { FC, useState } from 'react';

interface DomainSearchProps {
  domain: string;
}

const SearchDomains: FC<DomainSearchProps> = ({ domain: _domain }) => {
  const [value, setValue] = useState();

  return (
    <span>
      Search:{' '}
      <input value={value || ''} onChange={(e) => {}} placeholder="search" />
    </span>
  );
};

export default SearchDomains;
