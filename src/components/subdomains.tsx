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
import { Modal, Button } from 'antd';
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
  const [isSubdomainVisible, setSubdomainVisible] = useState(false);
  const [isTransferVisible, setTransferVisible] = useState(false);
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

  const dataSource: Object[] = [];

  Object.keys(domain.value.children).forEach((key) => {
    dataSource.push({
      key: key,
      asset: 'N/A',
      name: domain.value.children[Number(key)],
      volume: 'N/A',
    });
  });

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

  const showTransfer = () => {
    setTransferVisible(true);
  };

  const transferOk = () => {
    setTransferVisible(false);
  };

  const transferCancel = () => {
    setTransferVisible(false);
  };

  const showSubdomain = () => {
    setSubdomainVisible(true);
  };

  const subdomainOk = () => {
    setSubdomainVisible(false);
  };

  const subdomainCancel = () => {
    setSubdomainVisible(false);
  };

  return (
    <div id="subdomainsContainer">
      {account?.toLowerCase() === domain.value.owner.toLowerCase() ? (
        <>
          <div className="big-btn">
            <div className="btn-container">
              <button
                className="btn-sub"
                style={{ color: 'white' }}
                onClick={showSubdomain}
              >
                Create
              </button>
              <Modal
                title="subdomain"
                visible={isSubdomainVisible}
                onOk={subdomainOk}
                onCancel={subdomainCancel}
              >
                <Create
                  domainId={domain.value.id}
                  domainContext={domainContext}
                />
              </Modal>
            </div>
            <div className="btn-container2">
              <button
                className="transfer-btn"
                style={{ color: 'white' }}
                onClick={showTransfer}
              >
                Transfer
              </button>
              <Modal
                title="transfer"
                visible={isTransferVisible}
                onOk={transferOk}
                onCancel={transferCancel}
              >
                <Transfer
                  domainId={domain.value.id}
                  domainContext={domainContext}
                />
              </Modal>
            </div>
          </div>
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
          size="small"
          bordered
          title={() => 'Domain Table Header'}
          footer={() => 'Domain Table Footer'}
        />
      </div>
      <div
        style={{
          background: '#641f29',
          height: '40px',
          width: '80%',
          textAlign: 'right',
        }}
      >
        641f29
      </div>
      <div
        style={{
          background: '#cf7571',
          height: '40px',
          width: '80%',
          textAlign: 'right',
        }}
      >
        cf7571
      </div>
      <div
        style={{
          background: '#171730',
          height: '40px',
          width: '80%',
          textAlign: 'right',
        }}
      >
        171730
      </div>
      <div
        style={{
          background: '#953338',
          height: '40px',
          width: '80%',
          textAlign: 'right',
        }}
      >
        953338
      </div>
      <div
        style={{
          background: '#8f6554',
          height: '40px',
          width: '80%',
          textAlign: 'right',
        }}
      >
        8f6554
      </div>
      <div
        style={{
          background: '#584362',
          height: '40px',
          width: '80%',
          textAlign: 'right',
        }}
      >
        584362
      </div>
      <div
        style={{
          background: '#754735',
          height: '40px',
          width: '80%',
          textAlign: 'right',
        }}
      >
        754735
      </div>
      <div
        style={{
          background: '#8e7384',
          height: '40px',
          width: '80%',
          textAlign: 'right',
        }}
      >
        8e7384
      </div>
      <div
        style={{
          background: '#979b9f',
          height: '40px',
          width: '80%',
          textAlign: 'right',
        }}
      >
        979b9f
      </div>
      <div
        style={{
          background: '#1a3344',
          height: '40px',
          width: '80%',
          textAlign: 'right',
        }}
      >
        1a3344
      </div>
      <div
        style={{
          background: '#0f1619',
          height: '40px',
          width: '80%',
          textAlign: 'right',
        }}
      >
        0f1619
      </div>
      <div
        style={{
          background: '#224564',
          height: '40px',
          width: '80%',
          textAlign: 'right',
        }}
      >
        224564
      </div>
      <div
        style={{
          background: '#33566d',
          height: '40px',
          width: '80%',
          textAlign: 'right',
        }}
      >
        33566d
      </div>
      <div
        style={{
          background: '#b8bdca',
          height: '40px',
          width: '80%',
          textAlign: 'right',
        }}
      >
        b8bdca
      </div>
      <div
        style={{
          background: '#76b1ce',
          height: '40px',
          width: '80%',
          textAlign: 'right',
        }}
      >
        76b1ce
      </div>
      <div
        style={{
          background: '#678293',
          height: '40px',
          width: '80%',
          textAlign: 'right',
        }}
      >
        678293
      </div>
      <div
        style={{
          background: '#426582',
          height: '40px',
          width: '80%',
          textAlign: 'right',
        }}
      >
        426582
      </div>
      <div
        style={{
          background: '#414350',
          height: '40px',
          width: '80%',
          textAlign: 'right',
        }}
      >
        414350
      </div>
      <div
        style={{
          background: '#675b68',
          height: '40px',
          width: '80%',
          textAlign: 'right',
        }}
      >
        675b68
      </div>
    </div>
  );
};

export default Subdomains;
