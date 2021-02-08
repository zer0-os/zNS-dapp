import React, { FC, useState } from 'react';
import { useAsyncDebounce } from 'react-table';
interface SearchTableProps {
  filter: any;
  setFilter: any;
}

const GlobalFilter: FC<SearchTableProps> = ({ filter, setFilter }) => {
  const [value, setValue] = useState(filter);
  const onChange = useAsyncDebounce((value) => {
    setFilter(value || undefined);
  });

  return (
    <div className='search-bar-table-container'>
      <div className="search-bar-table">
        <input
          className="search-bar-input"
          type="text"
          value={value || ''}
          placeholder="Search"
          onChange={(e) => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
        />
        <button className="search-bar-button"></button>
      </div>
    </div>
  );
};

export default GlobalFilter;
