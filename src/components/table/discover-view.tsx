import React, { FC, useState, useMemo, useEffect, Children } from 'react';
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
  useFilters,
  useFlexLayout,
} from 'react-table';
import { string } from 'zod';
import Profile from './NFT-View/nft-view';
import Approve from './NFT-View/approval';
import TableImage from './table-image';
import SearchTable from './searchTable';
import NewDrops from './newDrops';
import marketimg from './css/img/chart.svg';
import '../../components/css/subdomains.scss';

interface DiscoverProps {
  domain: string;
}

const Discover: FC<DiscoverProps> = ({ domain: _domain }) => {
  const context = useWeb3React<Web3Provider>();
  const { library, account, active, chainId } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;

  const domainList = useMemo(() => {
    domain.map((domain) => {
      const name = domain.children;
      return name;
    });
  }, [domain]);
  if (domain.isNothing()) return null;
  console.log(domainList, 'DiscoverList');
  return (
    <>
      <div> {domainList} </div>
    </>
  );
};

export default Discover;
