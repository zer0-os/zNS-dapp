import React, { FC, useState, useMemo, useEffect, Children } from 'react';
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
  useFilters,
  useFlexLayout,
} from 'react-table';
import { string } from 'zod';
import Profile from './nft-view';
import Approve from './approval';
import TableImage from './table-image';
import SearchTable from './searchTable';
import NewDrops from './newDrops';
import marketimg from './css/img/chart.svg';
import { FixedSizeList } from 'react-window';
import { table } from 'console';
import '../components/css/subdomains.scss';

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
  asset: any;
  name: string;
  volume: string;
  '24Hr': string;
  '7d': string;
  marketcap: string;
  last7days: string;
  trade: string;
  timestamp: any;
}

interface TProps {
  domain: string;
}

const TableView: FC<TProps> = ({ domain: _domain }) => {
  const context = useWeb3React<Web3Provider>();
  const [sortConfig, setSortConfig] = useState();
  const [search, setSearch] = useState('');
  const [filterdData, setFilterdData] = useState([]);
  const location = useLocation();
  const contracts = useZnsContracts();
  const { account } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
  console.log('DOMAINTABLE!', domain);
  const history = useHistory();

  const dataInput: Data[] = useMemo(
    () =>
      domain.isNothing()
        ? []
        : _.map(domain.value.children, (key, i) => ({
            '#': i.toString(),
            // asset: <Profile domain={key} />,
            asset: <TableImage domain={key} />,
            name: key,
            volume: 'N/A',
            '24Hr': 'N/A',
            '7d': 'N/A',
            marketcap: 'N/A',
            last7days: '',
            trade: '',
            timestamp: '',
          })),
    [domain],
  );

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
      {
        Header: 'Last 7 Days',
        accessor: 'last7days',
        Cell: (props) => <img src={marketimg} alt="" />,
      },
      { Header: 'Trade', accessor: 'trade' },
      {
        Header: '',
        accessor: 'timestamp',
        width: '0px',
        Cell: () => <div style={{ display: 'none' }}></div>,
      },
    ],
    [],
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,

    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      // initialState: {
      //   hiddenColumns: ['timestamp'],
      // },
    },
    useFilters,
    useGlobalFilter,
    // useFlexLayout,
  );

  const handleRowClick = (row: any) => {
    console.log('fire');
    console.log(row);
    history.push({
      pathname: row.values.name,
    });
  };
  if (domain.isNothing()) return null;
  console.log(domain.value.children, 'xxxxxxxxxxxxxxxxx');
  return (
    <>
      <SearchTable setFilter={setGlobalFilter} filter={null} />

      <div>
        <div className="tableContainer">
          <table {...getTableProps()} className="subdomainsTable">
            {rows.length === 0 ? null : (
              <thead className="subdomainsHeaderGroupLocal">
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
                    <tr
                      onClick={() => handleRowClick(row)}
                      {...row.getRowProps()}
                    >
                      {
                        // Loop over the rows cells
                        row.cells.map((cell) => {
                          // Apply the cell props
                          return (
                            <td className="tdLocal" {...cell.getCellProps()}>
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
                  <td>
                    Footer text displays here when there are no subdomains
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
        <br />
        <br />
        {/* {colors.map((color) => {
        return (
          <div
            style={{
              background: '#' + color,
              height: '40px',
              width: '80%',
              textAlign: 'right',
            }}
          >
            {color}
          </div>
        );
      })} */}
      </div>
    </>
  );
};

export default TableView;
