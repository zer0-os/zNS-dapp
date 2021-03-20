import { FC, useState } from 'react';
import { useAsyncDebounce } from 'react-table';
import '../css/subdomains.scss';
interface SearchTableProps {
  globalFilter: any;
  setGlobalFilter: any;
}

const GlobalFilter: FC<SearchTableProps> = ({
  globalFilter,
  setGlobalFilter,
}) => {
  const [temp, setTemp] = useState(globalFilter);
  if (temp !== globalFilter) {
    setGlobalFilter(globalFilter);
    setTemp(globalFilter);
  }

  return null;
};

export default GlobalFilter;
