import React, { FC, useState } from 'react';
import { useAsyncDebounce } from 'react-table';

interface SearchProps {
  setGlobalFilter: any;
}

const SearchTable: FC<SearchProps> = ({ setGlobalFilter }) => {
  const [value, setValue] = useState(setGlobalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  });
  return (
    <span>
      Search:{' '}
      <input
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="search"
      />
    </span>
  );
};

export default SearchTable;
