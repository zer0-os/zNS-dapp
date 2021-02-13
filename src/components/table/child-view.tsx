import React, { FC, useState, useMemo, useEffect } from 'react';
import _ from 'lodash';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Link, useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useZnsContracts } from '../../lib/contracts';
import { useDomainCache } from '../../lib/useDomainCache';
import Transfer from '../transferDomains';
import Create from './create';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Modal, Button } from 'antd';
import Owned from '../topbar/profile/owned';
import { String } from 'lodash';
import {
  Column,
  useTable,
  usePagination,
  useGlobalFilter,
  useAsyncDebounce,
} from 'react-table';
import { string } from 'zod';
import Profile from './NFT-View/nft-view';
import Approve from './NFT-View/approval';
import TableView from './tableView';
import SearchTable from './searchTable';
import SetImage from './forms/set-image';
import linebutton from '../css/img/threelinebutton.png';
import squarebutton from '../css/img/squaregridbutton.png';
import NFTview from './NFT-View/nft-view';

interface SubdomainsProps {
  domain: string;
}

interface Data {
  '#': string;
  asset: any;
  name: string;
  volume: string;
  '24Hr': string;
  '7d': string;
  marketcap: string;
  last7days: string;
  trade: string;
}

const ChildView: FC<SubdomainsProps> = ({ domain: _domain }) => {
  const context = useWeb3React<Web3Provider>();

  const location = useLocation();
  const contracts = useZnsContracts();
  const { account } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
  const history = useHistory();
  const dataInput: Data[] = [];
  const [gridView, toggleGridView] = useState(false);

  useEffect(() => {
    console.log('ChildView', domain);
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

  const colors: string[] = [
    '641f29',
    'cf7571',
    '171730',
    '953338',
    '8f6554',
    '584362',
    '754735',
    '8e7384',
    '979b9f',
    '1a3344',
    '0f1619',
    '224564',
    '33566d',
    'b8bdca',
    '76b1ce',
    '678293',
    '426582',
    '414350',
    '675b68',
  ];
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
          <div>Discover</div>
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
                <img src={linebutton} alt="" />
              </div>
              <div
                onClick={() => toggleGridView(true)}
                className="sdbsrItem tableNavButton tnb1"
              >
                <img src={squarebutton} alt="" />
              </div>
              <div className="sdbsrItem sdbsrSort">
                <div>Sort</div>
                <div>Market Cap ▼</div>
              </div>
            </div>
          </div>
        </div>

        <TableView domain={domain.value.domain} gridView={gridView} />

        {account?.toLowerCase() === domain.value.owner.toLowerCase() ? (
          <>
            <div>
              <NFTview domain={domain.value.domain} />
              <Create
                domainId={domain.value.id}
                domainContext={domainContext}
              />
              <SetImage domain={domain.value.domain} />
            </div>
          </>
        ) : null}
        {/* // apply the table props */}
      </div>
    </div>
  );
};

export default ChildView;
