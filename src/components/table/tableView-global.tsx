import { FC, useState, useMemo } from 'react';
import _ from 'lodash';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useZnsContracts } from '../../lib/contracts';
import { useDomainCache } from '../../lib/useDomainCache';
import {
  Column,
  useTable,
  useGlobalFilter,
  useFilters,
} from 'react-table';
import TableImage from '././table-image-global';
import SearchTable from './searchTable';
import marketimg from '../css/img/chart.svg';
import Grid from './grid-view';
import '../../components/css/subdomains.scss';
import Nestedview from './NFT-View/nestedNFT-view';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ColumnProps {
  key: number;
  name: string;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface RowProps {
  id: number;
  domain: string;
}

interface Data {
  '#': string;
  image: any;
  network: string;
  token: string;
  volume: string;
  '24Hr': string;
  '7d': string;
  marketcap: string;
  last7days: string;
  timestamp: any;
  trade: string;
}

interface TProps {
  domain: string;
  gridView: boolean;
}

const TableViewGlobal: FC<TProps> = ({ domain: _domain, gridView }) => {
  const context = useWeb3React<Web3Provider>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sortConfig, setSortConfig] = useState();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [search, setSearch] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filterdData, setFilterdData] = useState([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const location = useLocation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const contracts = useZnsContracts();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { account } = context;
  const { useDomain, useAllDomains } = useDomainCache();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _allDomains, refetchAllDomains } = useAllDomains(_domain);
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
  const history = useHistory();

  console.log('ALL DOMAIN!!', _allDomains);
  console.log('DDOMAIN', domain);

  const dataInput: Data[] = useMemo(
    () =>
      domain.isNothing()
        ? []
        : _.map(domain.value.children, (key, i) => ({
            '#': i.toString(),
            // asset: <Profile domain={key} />,
            image: <TableImage domain={key} />,
            network: key,
            token: key + ' token',
            volume: 'N/A',
            '24Hr': 'N/A',
            '7d': 'N/A',
            marketcap: 'N/A',
            last7days: '',
            timestamp: '',
            trade: '',
          })),
    [domain],
  );
  const data = useMemo<Data[]>(() => dataInput, [dataInput]);

  const columns = useMemo<Column<Data>[]>(
    () => [
      {
        Header: (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '70px',
              height: '70px',
            }}
          >
            #
          </div>
        ),
        accessor: '#',
      },
      {
        Header: '',
        accessor: 'image',
      },
      { Header: 'Network', accessor: 'network' },
      { Header: 'Token', accessor: 'token' },
      { Header: 'Volume', accessor: 'volume' },
      { Header: '24Hr', accessor: '24Hr' },
      { Header: '7d', accessor: '7d' },
      { Header: 'Market Cap', accessor: 'marketcap' },
      {
        Header: 'Last 7 Days',
        accessor: 'last7days',
        Cell: (props) => <img src={marketimg} alt="" />,
      },
      {
        Header: '',
        accessor: 'timestamp',
        width: '0px',
        Cell: () => <div style={{ display: 'none' }}></div>,
      },
      {
        Header: 'Trade',
        accessor: 'trade',
        Cell: () => (
          <button className="tradeButton" style={{}}>
            $12,504
          </button>
        ),
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    page,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    canPreviousPage,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    canNextPage,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    pageOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    pageCount,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    gotoPage,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    nextPage,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    previousPage,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setPageSize,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useFilters,
    useGlobalFilter,
    // useFlexLayout,
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      pathname: row.values.network,
    });
  };
  if (domain.isNothing()) return null;
  console.log(domain, 'xxxxxxxxxxxxxxxxx');
  return (
    <div className="shiftTableUp">
      <SearchTable setFilter={setGlobalFilter} filter={null} />
      <div>
        {!gridView ? (
          <div className="tableContainer">
            <table {...getTableProps()} className="subdomainsTable">
              {rows.length === 0 ? null : (
                <thead className="subdomainsHeaderGroupGlobal">
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
                              <td className="tdGlobal" {...cell.getCellProps()}>
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
                      <Nestedview domain={_domain} />
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        ) : (
          <Grid domain={_domain} />
        )}

        <br />
        <br />
      </div>
    </div>
  );
};

export default TableViewGlobal;
