import { FC, useState } from 'react';

interface DomainSearchProps {
  domain: string;
}

const SearchDomains: FC<DomainSearchProps> = ({ domain: _domain }) => {
  const [value, setValue] = useState();

  return (
    <div className="search">
      <button className="search-bar-button"></button>
      <div className="search-bar-glow"></div>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => {}}
        placeholder="search"
      />
    </div>
  );
};

export default SearchDomains;
