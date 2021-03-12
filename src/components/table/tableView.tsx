import { FC, useMemo } from 'react';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import { useDomainCache } from '../../lib/useDomainCache';
import { Column, useTable, useGlobalFilter, useFilters } from 'react-table';
import TableImage from './table-image';
import SearchTable from './searchTable';
import marketimg from '../css/img/chart.svg';
import Grid from './grid-view';
import '../../components/css/subdomains.scss';
import Nestedview from './NFT-View/nestedNFT-view';

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// interface ColumnProps {
//   key: number;
//   name: string;
// }
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// interface RowProps {
//   id: number;
//   domain: string;
// }

interface Data {
  '#': string;
  asset: any;
  name: string;
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

const TableView: FC<TProps> = ({ domain: _domain, gridView }) => {
  // const context = useWeb3React<Web3Provider>();
  // const { account } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
  const history = useHistory();

  // const defaultColumn = React.useMemo(
  //   () => ({
  //     width: 150,
  //   }),
  //   [],
  // );

  const dataInput: Data[] = useMemo(
    () =>
      domain.isNothing()
        ? []
        : _.map(domain.value.children, (key, i) => ({
            key: key,
            '#': i.toString(),
            // asset: <Profile domain={key} />,
            asset: (
              <div className="domainImageContainer">
                <TableImage domain={key} />
              </div>
            ),
            name: key,
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

  console.log(dataInput, 'THIS List');
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
        Header: 'Asset',
        accessor: 'asset',
      },
      {
        Header: 'Name',
        accessor: 'name',
        width: '100%',
        Cell: (props) => (
          <span
            style={{
              width: '180px',
              maxWidth: '180px',
              display: 'flex',
              flexWrap: 'wrap',
              // height: '100%',
              wordWrap: 'break-word',
              verticalAlign: 'center',
            }}
          >
            {console.log('PROPS!!!', props)}
            <span
              style={{
                textAlign: 'left',
                width: '100%',
                wordWrap: 'break-word',
              }}
            >
              {props.data[0].key}
            </span>
          </span>
        ),
      },
      { Header: 'Volume', accessor: 'volume' },
      { Header: '24Hr', accessor: '24Hr' },
      { Header: '7d', accessor: '7d' },
      {
        Header: 'Market Cap',
        accessor: 'marketcap',
        // Cell: (props) => {
        //   <div>{JSON.stringify(props)}</div>;
        // },
      },
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
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      // defaultColumn,
      // initialState: {
      //   hiddenColumns: ['timestamp'],
      // },
    },
    useFilters,
    useGlobalFilter,
    // useAbsoluteLayout,
  );

  const handleRowClick = (row: any) => {
    console.log('fire');
    console.log(row);
    history.push({
      pathname: row.original.key,
    });
  };

  if (domain.isNothing()) return null;
  console.log(domain.value.children, 'xxxxxxxxxxxxxxxxx');
  return (
    <div className="shiftTableUp">
      <SearchTable setFilter={setGlobalFilter} filter={null} />

      <div>
        {!gridView ? (
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
    </div>
  );
};

export default TableView;
