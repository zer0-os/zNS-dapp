import { FC, useState, useEffect } from 'react';
import _ from 'lodash';
import { Link, useLocation } from 'react-router-dom';
import { useDomainCache } from '../../lib/useDomainCache';
import TableView from './tableView';
import NFTPage from './NFT-View/ntfpage';
import linebutton from '../css/img/threelinebutton.png';
import squarebutton from '../css/img/squaregridbutton.png';
import linebuttongrey from '../css/img/threelinebuttongrey.png';
import squarebuttonwhite from '../css/img/squaregridbuttonwhite.png';
import AdBar from './adbar';
import filtericon from '../css/img/filtericon.png';
import filterarrow from '../css/img/filterarrow.png';
import listselected from '../css/img/listselected.png';
// import listunselected from '../css/img/listunselected.png';
// import gridselected from '../css/img/gridselected.png';
import gridunselected from '../css/img/gridunselected.png';

interface SubdomainsProps {
  domain: string;
}

const ChildView: FC<SubdomainsProps> = ({ domain: _domain }) => {
  // const context = useWeb3React<Web3Provider>();
  const location = useLocation();
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
  const [gridView, toggleGridView] = useState(false);

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

  console.log('DOMAIN!', domain);

  useEffect(() => {
    //console.log('ChildView', domain);
  }, [domain]);
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

  if (domain.isNothing()) return null;
  return (
    <div className="pageContainerPositionFix">
      {domain.value.children.length !== 0 ? (
        <div>
          <div className="metricsBar">
            {/* <div className="metricsTitle">Metrics</div> */}
            <div className="metricsContainer">
              {metric('WILDER PRICE', '$2,000', '@0.0410', '(▲41.10%)')}
              {metric('WILDER PRICE', '$2,000', '@0.0410', '(▲41.10%)')}
              {metric('WILDER PRICE', '$2,000', '@0.0410', '(▲41.10%)')}
              {metric('WILDER PRICE', '$2,000', '@0.0410', '(▲41.10%)')}
              {metric('WILDER PRICE', '$2,000', '@0.0410', '(▲41.10%)')}
              {metric('WILDER PRICE', '$2,000', '@0.0410', '(▲41.10%)')}
              {metric('Total Wild Holders', '12,302', '', '')}
            </div>
          </div>

          <AdBar domain={domain.value.domain} />

          <div id="subdomainsContainer">
            <div className="subdomainsSortBar">
              {/* <div>
            <div className="route-nav">
              <div className="route-nav-link">
            
                <Link className="route-nav-text" to={'/'}>
                  0::/
                </Link>
              </div>
              {routes.map(([key, path], i) => (
                <div key={key} className="route-nav-link">
                  <Link className="route-nav-text-sub" to={path}>
                    {key}
                    {i < routes.length - 1 && '.'}
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div className="subdomainsButtonSortContainer">
            <div className="subdomainsButtonSortLeft">
              <div className="sdbslItem sdbslItemSelected">
                <span className="bolt">⚡</span> New Drops{' '}
                <span className="bolt">⚡</span>
              </div>
              <div className="sdbslItem">Trending</div>
              <div className="sdbslItem">Leaderboard</div>
              <div className="sdbslItem">Top Collectors</div>
            </div>
            <div className="subdomainsButtonSortRight">
              {' '}
              <div
                onClick={() => toggleGridView(false)}
                className="sdbsrItem tableNavButton tnb2"
              >
                <img src={!gridView ? linebutton : linebuttongrey} alt="" />
              </div>
              <div
                onClick={() => toggleGridView(true)}
                className="sdbsrItem tableNavButton tnb1"
              >
                <img src={gridView ? squarebuttonwhite : squarebutton} alt="" />
              </div>
         
            </div>
          </div> */}
              <div className="subdomainsBar">
                <div className="search">
                  <button className="search-bar-button"></button>
                  <div className="search-bar-glow"></div>
                  <input
                    className="searchBar"
                    type="text"
                    placeholder="Search by Creator, Creation, and Collection"
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
                  <div className="number">
                    <div className="text">100</div>
                    <div className="imgContainer">
                      <img src={filterarrow} alt="" />
                      <img src={filterarrow} alt="" />
                    </div>
                  </div>
                  <div
                    onClick={() => toggleGridView(false)}
                    className={`list ${gridView ? '' : 'selected'}`}
                  >
                    <div className="lines">
                      <img src={listselected} alt="" />
                    </div>
                  </div>
                  <div
                    onClick={() => toggleGridView(true)}
                    className={`grid ${gridView ? 'selected' : ''}`}
                  >
                    <div className="squares">
                      <img src={gridunselected} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <TableView domain={domain.value.domain} gridView={gridView} />
          </div>
        </div>
      ) : (
        <NFTPage domain={domain.value.domain} />
      )}
    </div>
  );
};

export default ChildView;
