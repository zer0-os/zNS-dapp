import { FC, useState } from 'react';
import { useAsyncDebounce } from 'react-table';
import '../css/subdomains.scss';
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
    <div className="search">
      <button className="search-bar-button"></button>
      <div className="search-bar-glow"></div>
      <input
        className="searchBar"
        type="text"
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="Search by Creator, Creation, and Collection"
      ></input>
    </div>
  );
};

export default GlobalFilter;
