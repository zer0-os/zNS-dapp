import React, { FC, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useZnsContracts } from '../lib/contracts';
import { useDomainCache } from '../lib/useDomainCache';
import Transfer from './transferDomains';
import Create from './create';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
interface SubdomainsProps {
  domain: string;
}

interface ColumnProps {
  key: number;
  name: string;
}
interface RowProps {
  id: number;
  domain: string;
}

const Subdomains: FC<SubdomainsProps> = ({ domain: _domain }) => {
  const [values, setValues] = useState([]);
  const context = useWeb3React<Web3Provider>();
  const contracts = useZnsContracts();
  const { library, account, active, chainId } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
  const history = useHistory();
  if (domain.isNothing()) return <p>Loading</p>;

  const data = domain.value.children.map((child, i) => [child.toString()]);
  console.log(data);

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
      key: domain.value.id,
      assest: 'N/A',
      name: domain.value.children,
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
      dataIndex: 'asset',
      key: 'asset',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      key: 'volume',
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
      dataIndex: 'market Cap',
      key: 'market Cap',
    },
    {
      title: 'Last 7 days',
      dataIndex: 'last 7 days',
      key: 'last 7 days',
    },
    {
      title: 'Trade',
      dataIndex: 'trade',
      key: 'trade',
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
        {/* <Link to={'/' + domain.value.domain.replace(/\./, '/')}>
          Domain: {domain.value.domain}
        </Link> */}
        {/* old subdomains code */}
        {/* <div>
          Children:
          {domain.value.children.map((child) => (
            <div key={child}>
              <Link to={'/' + child.replace(/\./, '/')}>{child}</Link>
            </div>
          ))}
        </div> */}
        {/* <div>Owner: {domain.value.owner}</div> */}
        <Table
          dataSource={dataSource}
          columns={columns}
          size="middle"
          bordered
          title={() => 'Domain Table Header'}
          footer={() => 'Domain Table Footer'}
        />
      </div>
    </div>
  );
};

export default Subdomains;
