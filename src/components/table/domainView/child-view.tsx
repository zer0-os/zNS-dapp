import { FC, useState, useEffect } from 'react';
import _, { set } from 'lodash';
import { Link, useLocation } from 'react-router-dom';
// import { useDomainCache } from '../../../lib/useDomainCache';
import TableView from '../table/tableView';
import NFTPage from '../NFT-View/ntfpage';
import linebutton from '../css/img/threelinebutton.png';
import squarebutton from '../css/img/squaregridbutton.png';
import linebuttongrey from '../css/img/threelinebuttongrey.png';
import squarebuttonwhite from '../css/img/squaregridbuttonwhite.png';
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
import { useDomainCache } from '../../../lib/useDomainCache';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';

import PreviewCard from '../../PreviewCard/PreviewCard-New';
import StaticEmulator from '../../../lib/StaticEmulator/StaticEmulator.js';

const previewData = {
  owner: {
    domain: '0.cyber.n3o',
    img: '/assets/wilderverse.png',
  },
  creator: {
    domain: '0.wilder.frank',
    img: '/assets/wilderverse.png',
  },
  name: 'Frank Wilder',
  domain: '0://wilder.frank',
  description:
    'Great artists use the tools of their time to reflect the concerns of their time. Great art is the intersection of personality, opportunity and timing.',
  img: 'assets/nft/redpill.png',
};

interface SubdomainsProps {
  domain: string;
  isGridView: boolean;
  toggleGridView: (arg0: boolean) => void;
}

const ChildView: FC<SubdomainsProps> = ({
  domain: _domain,
  isGridView,
  toggleGridView,
}) => {
  // const context = useWeb3React<Web3Provider>();
  const location = useLocation();
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
  // const [gridView, toggleGridView] = useState(false);
  const [hover, setHover] = useState('');
  const [uploadedImage, setUploadedImage] = useState<
    string | ArrayBuffer | null
  >(null);
  const [descriptions, setDescription] = useState(null);
  const [names, setName] = useState('');
  const [Image, setImage] = useState('');
  const [shouldViewNftPage, setShouldViewNftPage] = useState(false);
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

  const onPreviewLink = () => {
    setShouldViewNftPage(true);
  };

  useEffect(() => setShouldViewNftPage(false), [domain]);

  // const ipfsreq = async () => {
  //   const ipfsLib = require('ipfs-api');
  //   const ipfsClient = new ipfsLib({
  //     host: 'ipfs.infura.io',
  //     port: 5001,
  //     protocol: 'https',
  //   });
  //   if (name.isNothing()) return null;
  //   const cid = await ipfsClient.cat(name.value.metadata.slice(21));
  //   return (

  //   );
  // };

  // const descrii = () => {
  //   let desc = ipfsreq();
  //   console.log(desc);
  // };

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

  if (domain.isNothing())
    return <div style={{ backgroundColor: 'black' }}></div>;

  return (
    <div className="pageContainerPositionFix">
      {domain.value.subdomains.length && !shouldViewNftPage ? (
        <div>
          <PreviewCard
            domain={domain.value.name}
            props={''}
            onClickLink={onPreviewLink}
          />

          {/* <div className="metricsBar">
            <div className="metricsTitle">Metrics</div>
            <div className="metricsContainer">
              {metric('WILDER PRICE', '$2,000', '', '(▲01.10%)')}
              {metric('WILDER PRICE', '$1,000', '', '(▲23.11%)')}
              {metric('WILDER PRICE', '$3,040', '', '(▲41.14%)')}
              {metric('WILDER PRICE', '$200', '', '(▲78.50%)')}
              {metric('WILDER PRICE', '$560', '', '(▲61.70%)')}
              {metric('WILDER PRICE', '$2,600', '', '(▲03.80%)')}
              {metric('Total Wild Holders', '12,302', '', '')}
            </div>
          </div> */}

          {/* <AdBar domain={domain.value.name} /> */}

          <div id="subdomainsContainer" className="border-primary">
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
                    placeholder="Search by Creator, Creation, and Collection"
                    // value={search || ''}
                    type="text"
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                  ></input>
                </div>
                <div className="buttons">
                  {/* <div className="filter">
                    <div className="imgContainer">
                      <img src={filtericon} alt="" />
                      <img src={filtericon} alt="" />
                    </div>
                    <div className="text">Filters</div>
                  </div> */}
                  <div
                    onClick={() => toggleGridView(false)}
                    // onMouseDown={() => setDown('list')}
                    // onMouseUp={() => setDown('')}
                    onMouseEnter={() => setHover('list')}
                    onMouseLeave={() => {
                      // setDown('');
                      setHover('');
                    }}
                    className={`list ${isGridView ? '' : 'selected'}`}
                  >
                    <img
                      src={
                        // down === 'list'
                        //   ? listD
                        //   :
                        isGridView === false
                          ? listS
                          : hover === 'list'
                          ? listH
                          : list
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
                    className={`grid ${isGridView ? 'selected' : ''}`}
                  >
                    <img
                      src={
                        // down === 'grid'
                        //   ? gridD
                        //   :
                        isGridView === true
                          ? gridS
                          : hover === 'grid'
                          ? gridH
                          : grid
                      }
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>

            <TableView domain={_domain} gridView={isGridView} search={search} />
          </div>
        </div>
      ) : (
        <NFTPage domain={_domain} />
      )}
    </div>
  );
};

export default ChildView;
