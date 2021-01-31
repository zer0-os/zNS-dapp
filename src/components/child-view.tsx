import React, { FC, useState, useMemo, useEffect } from 'react';
import _ from 'lodash';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Link, useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useZnsContracts } from '../lib/contracts';
import { useDomainCache } from '../lib/useDomainCache';
import Transfer from './transferDomains';
import Create from './create';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Modal, Button } from 'antd';
import Owned from './owned';
import { String } from 'lodash';
import {
  Column,
  useTable,
  usePagination,
  useGlobalFilter,
  useAsyncDebounce,
} from 'react-table';
import { string } from 'zod';
import Profile from './nft-view';
import Approve from './approval';
import TableView from './tableView';
import SearchTable from './searchTable';
import SetImage from './forms/set-image';
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
      <div className="metric">
        <div className="metricField">{name}</div>
        <div className="metricField">{price}</div>
        <div className="metricField">
          {unit} <span className="metricPercent">{percent}</span>
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
  console.log('r', routes);
  if (domain.isNothing()) return <p>Loading</p>;
  return (
    <div>
      <div className="metricsBar">
        <div className="metricsTitle">Metrics</div>
        <div className="metricsContainer">
          {metric('WILDER PRICE', '$2000', '@0.0410', '(+41.10%)')}
          {metric(
            'MARKET CAP',
            '$369,000,101',
            'Fully diluted market cap for WILD',
            '',
          )}
        </div>
      </div>
      <div id="subdomainsContainer">
        <img
          style={{ height: '10%', width: '10%' }}
          src={domain.value.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
        />

        <div className="route-nav">
          <div className="route-nav-link">
            <Link to={'/'}>Z:/</Link>
          </div>
          {routes.map(([key, path], i) => (
            <div className="route-nav-link">
              <Link to={path}>
                {key}
                {i < routes.length - 1 && '.'}
              </Link>
            </div>
          ))}
        </div>
        <TableView domain={domain.value.domain} />

        {account?.toLowerCase() === domain.value.owner.toLowerCase() ? (
          <>
            <div>
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
