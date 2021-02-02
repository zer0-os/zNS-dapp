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
    <span>
      <span>
        Search:{' '}
        <input
          type="text"
          value={value || ''}
          onChange={(e) => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
          placeholder="search"
        />{' '}
        note: moving search to topbar
      </span>
    </span>
  );
};

export default GlobalFilter;
