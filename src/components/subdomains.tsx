import React, { FC, useState, useMemo } from 'react';
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
import Owned from './owned';
import { String } from 'lodash';
import { Column, useTable, UseTableOptions } from 'react-table';
import { string } from 'zod';

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

interface Data {
  '#': string;
  asset: string;
  name: string;
  volume: string;
  '24Hr': string;
  '7d': string;
  marketcap: string;
  last7days: string;
  trade: string;
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
  const dataInput: Data[] = [];
  if (domain.isNothing()) {
  } else {
    Object.keys(domain.value.children).forEach((key) => {
      dataInput.push({
        '#': '',
        asset: 'N/A',
        name: domain.value.children[Number(key)],
        volume: 'N/A',
        '24Hr': 'N/A',
        '7d': 'N/A',
        marketcap: 'N/A',
        last7days: 'N/A',
        trade: 'N/A',
      });
    });
  }
  const data = useMemo<Data[]>(() => dataInput, [dataInput]);
  const columns = useMemo<Column<Data>[]>(
    () => [
      {
        Header: '#',
        accessor: '#',
      },
      {
        Header: 'Asset',
        accessor: 'asset',
      },
      { Header: 'Name', accessor: 'name' },
      { Header: 'Volume', accessor: 'volume' },
      { Header: '24Hr', accessor: '24Hr' },
      { Header: '7d', accessor: '7d' },
      { Header: 'Market Cap', accessor: 'marketcap' },
      { Header: 'Last 7 Days', accessor: 'last7days' },
      { Header: 'Trade', accessor: 'trade' },
    ],
    [],
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });
  if (domain.isNothing()) return <p>Loading</p>;

  const options = {
    onRowClick: (rowData: any) =>
      history.push({
        pathname: rowData[0],
      }),
    filter: false,
    selectableRowsHideCheckboxes: true,
    sort: false,
  };

  const handleRowClick = (row: any) => {
    console.log('fire');
    console.log(row);
    history.push({
      pathname: row.values.name,
    });
  };

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

  // const handleRowClick = (record: any) => {
  //   history.push({
  //     pathname: record.name,
  //   });
  // };

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
          <div>
            <Owned />
          </div>
        </>
      ) : null}
      {/* // apply the table props */}
      <table {...getTableProps()} className="subdomainsTable">
        {rows.length === 0 ? null : (
          <thead className="subdomainsHeaderGroup">
            {
              // Loop over the header rows
              headerGroups.map((headerGroup) => (
                // Apply the header row props
                <tr
                  className="subdomainsHeaderTR"
                  {...headerGroup.getHeaderGroupProps()}
                >
                  {
                    // Loop over the headers in each row
                    headerGroup.headers.map((column) => (
                      // Apply the header cell props
                      <th
                        className="subdomainsHeaderTH"
                        {...column.getHeaderProps()}
                      >
                        {
                          // Render the header
                          column.render('Header')
                        }
                      </th>
                    ))
                  }
                </tr>
              ))
            }
          </thead>
        )}
        {/* Apply the table body props */}
        <tbody {...getTableBodyProps()}>
          {console.log('ROWS', rows)}

          {
            // Loop over the table rows
            rows.map((row) => {
              // Prepare the row for display
              prepareRow(row);
              return (
                // Apply the row props
                <tr onClick={() => handleRowClick(row)} {...row.getRowProps()}>
                  {
                    // Loop over the rows cells
                    row.cells.map((cell) => {
                      // Apply the cell props
                      return (
                        <td {...cell.getCellProps()}>
                          {
                            // Render the cell contents
                            cell.render('Cell')
                          }
                        </td>
                      );
                    })
                  }
                </tr>
              );
            })
          }
        </tbody>
        {rows.length !== 0 ? null : (
          <tfoot>
            <tr>
              <td>Footer text displays here when there are no subdomains</td>
            </tr>
          </tfoot>
        )}
      </table>
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
