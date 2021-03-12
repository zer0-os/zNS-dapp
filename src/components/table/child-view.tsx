import { FC, useState, useEffect } from 'react';
import _ from 'lodash';
import { Link, useLocation } from 'react-router-dom';
import { useDomainCache } from '../../lib/useDomainCache';
import TableView from './tableView';
import linebutton from '../css/img/threelinebutton.png';
import squarebutton from '../css/img/squaregridbutton.png';
import linebuttongrey from '../css/img/threelinebuttongrey.png';
import squarebuttonwhite from '../css/img/squaregridbuttonwhite.png';

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
          <div className="metricField">{name}</div>
          <div className="metricField">{price}</div>
          <div className="metricField">
            {unit} <span className="metricPercent">{percent}</span>
          </div>
        </div>
      </div>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const colors: string[] = [
  //   '641f29',
  //   'cf7571',
  //   '171730',
  //   '953338',
  //   '8f6554',
  //   '584362',
  //   '754735',
  //   '8e7384',
  //   '979b9f',
  //   '1a3344',
  //   '0f1619',
  //   '224564',
  //   '33566d',
  //   'b8bdca',
  //   '76b1ce',
  //   '678293',
  //   '426582',
  //   '414350',
  //   '675b68',
  // ];
  if (domain.isNothing()) return null;
  return (
    <div>
      <div className="metricsBar">
        <div className="metricsTitle">Metrics</div>
        <div className="metricsContainer">
          {metric('WILDER PRICE', '$2,000', '@0.0410', '(+41.10%)')}
          {metric('WILDER PRICE', '$2,000', '@0.0410', '(+41.10%)')}
          {metric('WILDER PRICE', '$2,000', '@0.0410', '(+41.10%)')}
          {metric('WILDER PRICE', '$2,000', '@0.0410', '(+41.10%)')}
          {metric('WILDER PRICE', '$2,000', '@0.0410', '(+41.10%)')}
          {metric(
            'MARKET CAP',
            '$369,000,101',
            'Fully diluted market cap for WILD',
            '',
          )}
        </div>
      </div>

      <div id="subdomainsContainer">
        <div className="subdomainsSortBar">
          <div>
            <div className="route-nav">
              <div className="route-nav-link">
                {/* <div>ZNS</div> */}
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
              {/* <div className="sdbsrItem sdbsrSort">
                <div>Sort</div>
                <div>Market Cap ▼</div>
              </div> */}
            </div>
          </div>
        </div>

        <TableView domain={domain.value.domain} gridView={gridView} />

        {/* // apply the table props */}
      </div>
    </div>
  );
};

export default ChildView;
