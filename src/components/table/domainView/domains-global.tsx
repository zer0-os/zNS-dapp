import { FC, useState } from 'react';
import _ from 'lodash';
import { Link, useLocation } from 'react-router-dom';
import { useDomainCache } from '../../../lib/useDomainCache';
import TableViewGlobal from '../table/tableView-global';
import linebutton from '../css/img/threelinebutton.png';
// import squarebutton from './img/squaregridbutton.png';
// import linebuttongrey from './img/threelinebuttongrey.png';
// import squarebuttonwhite from './img/squaregridbuttonwhite.png';
import AdBar from '../adBar/adbar';
import filtericon from '../../css/img/filtericon.png';
import filterarrow from '../../css/img/filterarrow.png';
import list from './img/tablebar/list-default.png';
import listD from './img/tablebar/list-down.png';
import listH from './img/tablebar/list-hover.png';
import listS from './img/tablebar/list-select.png';
import grid from './img/tablebar/grid-default.png';
import gridD from './img/tablebar/grid-down.png';
import gridH from './img/tablebar/grid-hover.png';
import gridS from './img/tablebar/grid-select.png';
import { concatAST } from 'graphql';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { useWeb3React } from '@web3-react/core';
interface DomainsGlobalProps {
  domain: string;
}
const DomainsGlobal: FC<DomainsGlobalProps> = ({ domain: _domain }) => {
  // const context = useWeb3React<Web3Provider>();
  console.log(_domain, 'GLOBALDOMAIN');
  const location = useLocation();
  const { useDomain } = useDomainCache();

  const domainContext = useDomain(_domain);
  const { name } = domainContext;

  // const dataInput: Data[] = [];
  const [gridView, toggleGridView] = useState(false);
  const [hover, setHover] = useState('');
  // const [down, setDown] = useState('');
  const [search, setSearch] = useState('');

  const routes = _.transform(
    location.pathname
      .substr(1)
      .split('.')
      .filter((s) => s !== ''),
    (acc: [string, string][], val, i) => {
      let next = 0 < i ? acc[i - 1][1] + '.' + val : val;
      acc.push([val, next]);
    },
  );

  //useEffect(() => {
  //console.log('ChildView', domain);
  //}, [domain]);
  // const showSubdomain = () => {
  //   setSubdomainVisible(true);
  // };

  // const subdomainOk = () => {
  //   setSubdomainVisible(false);
  // };

  // const subdomainCancel = () => {
  //   setSubdomainVisible(false);
  // };

  // const handleRowClick = (record: any) => {
  //   history.push({
  //     pathname: record.name,
  //   });
  // };
  const metric = (
    name: string,
    price: string,
    unit: string,
    percent: string,
  ) => {
    return (
      <div className="metricBlock">
        <div className="metric">
          <div className="metricTitle">
            <div> {name} </div>
            <div className="info">
              <div className="symbol">?</div>
            </div>
          </div>
          <div className="metricPrice">{price}</div>
          <div className="metricBottom">
            {unit} <span className="metricPercent">{percent}</span>
          </div>
        </div>
      </div>
    );
  };

  if (name.isNothing()) return null;
  return (
    <div className="pageContainerPositionFix">
      {/* Metrics bar is removed for now: may be added back in further iterations */}
      {/* <div className="metricsBar">
        <div className="metricsContainer">
          {metric('Wild Price', '$2,010', '', '(▲41.10%)')}
          {metric('24hr Volume', '$3,069,333,102', '', '(▲12.03%)')}
          {metric('Token HODLrs', '3,960,013', '', '(▲2.01%)')}
          {metric('24hr NFTs Sold', '5,103', '', '(▲9.93%)')}
          {metric('Active Subdomains', '3,666', '', '(▲1.11%)')}
        </div>
      </div> */}

      {/* <AdBar domain={_domain} /> */}

      <div id="subdomainsContainer">
        <div className="subdomainsSortBar">
          <div className="route-nav">
            <div className="route-nav-link">
              <Link className="route-nav-text" to={'/'}>
                0::/
              </Link>
            </div>
            {routes.map(([key, path], i) => (
              <div className="route-nav-link">
                <Link className="route-nav-text-sub" to={path}>
                  {key}
                  {i < routes.length - 1 && '.'}
                </Link>
              </div>
            ))}
          </div>
          <div className="subdomainsButtonSortContainer">
            <div className="subdomainsButtonSortLeft">
              <div className="sdbslItem sdbslItemSelected">Zero Networks</div>
              <div className="sdbslItem">NFTs</div>
              <div className="sdbslItem">DAOs</div>
              <div className="sdbslItem">Universes</div>
            </div>
            <div className="subdomainsButtonSortRight">
              {' '}
              <div
                onClick={() => toggleGridView(false)}
                className="sdbsrItem tableNavButton tnb2"
              >
                {/* <img src={!gridView ? linebutton : linebuttongrey} alt="" /> */}
              </div>
              <div
                onClick={() => toggleGridView(true)}
                className="sdbsrItem tableNavButton tnb1"
              >
                {/* <img src={gridView ? squarebuttonwhite : squarebutton} alt="" /> */}
              </div>
            </div>
          </div>

          <div className="subdomainsBar">
            <div className="search">
              <button className="search-bar-button"></button>
              <div className="search-bar-glow"></div>
              <input
                className="searchBar"
                placeholder="Search by Creator, Creation, and Collection"
                // value={search || ''}
                type="text"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              ></input>
            </div>
            <div className="buttons">
              <div className="filter">
                <div className="imgContainer">
                  <img src={filtericon} alt="" />
                  <img src={filtericon} alt="" />
                </div>
                <div className="text">Filters</div>
              </div>
              <div
                onClick={() => toggleGridView(false)}
                // onMouseDown={() => setDown('list')}
                // onMouseUp={() => setDown('')}
                onMouseEnter={() => setHover('list')}
                onMouseLeave={() => {
                  // setDown('');
                  setHover('');
                }}
                className={`list ${gridView ? '' : 'selected'}`}
              >
                <img
                  src={
                    // down === 'list'
                    //   ? listD
                    //   :
                    gridView === false ? listS : hover === 'list' ? listH : list
                  }
                  alt=""
                />
              </div>
              <div
                onClick={() => toggleGridView(true)}
                // onMouseDown={() => setDown('grid')}
                // onMouseUp={() => setDown('')}
                onMouseEnter={() => setHover('grid')}
                onMouseLeave={() => {
                  // setDown('');
                  setHover('');
                }}
                className={`grid ${gridView ? 'selected' : ''}`}
              >
                <img
                  src={
                    // down === 'grid'
                    //   ? gridD
                    //   :
                    gridView === true ? gridS : hover === 'grid' ? gridH : grid
                  }
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        {console.log(name, 'NAME DOMAINS VIEW')}
        <TableViewGlobal domain={_domain} gridView={gridView} search={search} />
      </div>
    </div>
  );
};

export default DomainsGlobal;
