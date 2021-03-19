import { FC, useState } from 'react';
import { useAsyncDebounce } from 'react-table';
import '../css/subdomains.scss';
interface SearchTableProps {
  filter: any;
  setFilter: any;
  search: string;
}

const GlobalFilter: FC<SearchTableProps> = ({ filter, setFilter, search }) => {
  const [value, setValue] = useState(filter);
  useAsyncDebounce((search) => {
    setFilter(value || undefined);
  });

  return null;
};

export default GlobalFilter;
