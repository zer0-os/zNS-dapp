import { domain } from 'process';
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
  const handleClick = (e: any) => {
    e.preventDefault();

    console.log('doge');
    console.log();
    setFilter({ id: '9' });
  };

  return (
    <span>
      <span>
        <button> New Drops</button>)
      </span>
    </span>
  );
};

export default GlobalFilter;
