import React, { FC } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useZnsContracts } from '../lib/contracts';
import { useDomainCache } from '../lib/useDomainCache';
import Transfer from './transferDomains';
import Create from './create';
import { Table } from 'antd';
interface SubdomainsProps {
  domain: string;
}

interface RowProps {
  id: number;
  domain: string;
}

const Subdomains: FC<SubdomainsProps> = ({ domain: _domain }) => {
  const context = useWeb3React<Web3Provider>();
  const contracts = useZnsContracts();
  const { library, account, active, chainId } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
  const history = useHistory();
  if (domain.isNothing()) return <p>Loading</p>;

  const data = domain.value.children.map((child, i) => [child.toString()]);

  const options = {
    onRowClick: (rowData: any) =>
      history.push({
        pathname: rowData[0],
      }),
    filter: false,
    selectableRowsHideCheckboxes: true,
    sort: false,
  };

  const dataSource = [
    {
      key: '1',
      name: data,
    },
    {
      key: '1',
      volume: 'N/A',
    },
  ];

  const columns = [
    {
      title: '#',
      dataIndex: '#',
      key: '#',
    },

    {
      title: 'Asset',
      dataIndex: 'Asset',
      key: 'Asset',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Volume',
      dataIndex: 'Volume',
      key: 'Volume',
    },
    {
      title: '24Hr',
      dataIndex: '24Hr',
      key: '24Hr',
    },
    {
      title: '7d',
      dataIndex: '7d',
      key: '7d',
    },
    {
      title: 'Market Cap',
      dataIndex: 'Market Cap',
      key: 'Market Cap',
    },
    {
      title: 'Last 7 days',
      dataIndex: 'Last 7 days',
      key: 'Last 7 days',
    },
    {
      title: 'Trade',
      dataIndex: 'Trade',
      key: 'Trade',
    },
  ];

  return (
    <div id="subdomainsContainer">
      {account?.toLowerCase() === domain.value.owner.toLowerCase() ? (
        <>
          <Create domainId={domain.value.id} domainContext={domainContext} />
          <Transfer domainId={domain.value.id} domainContext={domainContext} />
        </>
      ) : null}
      <div id="domainContainer">
        <Link to={'/' + domain.value.domain.replace(/\./, '/')}>
          Domain: {domain.value.domain}
        </Link>
        {/* old subdomains code */}
        {/* <div>
          Children:
          {domain.value.children.map((child) => (
            <div key={child}>
              <Link to={'/' + child.replace(/\./, '/')}>{child}</Link>
            </div>
          ))}
        </div> */}
        <div>Owner: {domain.value.owner}</div>
        <Table dataSource={dataSource} columns={columns} />
      </div>
    </div>
  );
};

export default Subdomains;
