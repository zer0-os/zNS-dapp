import { FC, useMemo, useLayoutEffect, useEffect, useState } from 'react';
import _, { random } from 'lodash';
import { useHistory } from 'react-router-dom';
import { useDomainCache } from '../../../lib/useDomainCache';
import { Column, useTable, useGlobalFilter, useFilters } from 'react-table';
import TableImage from './table-image-global';
import SearchTable from './searchTable';
import marketimg from '../../css/img/chart.svg';
import graph1 from './img/mockgraphs/graph1.png';
import graph2 from './img/mockgraphs/graph2.png';
import graph3 from './img/mockgraphs/graph3.png';
import graph4 from './img/mockgraphs/graph4.png';
import graph5 from './img/mockgraphs/graph5.png';
import Grid from './grid-view';
import './css/subdomains.scss';
import Image from '../mockup/image';
import { any } from 'zod';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import Nestedview from '../NFT-View/nestedNFT-view';
import wilderavatar from '../../css/img/wilderavatar.png';
import neo from '../../css/img/neo.jpeg';
import kitty from '../../css/img/kitty.jpeg';
import cybercar from '../../css/img/cybercar.jpeg';
import realestate from '../../css/img/realestate.jpeg';
import FutureButton from '../../Buttons/FutureButton/FutureButton.js';

const images = [wilderavatar, neo, kitty, cybercar, realestate];
const randomImage = () => images[Math.floor(Math.random() * images.length)];
//
// Please Read
// Much data availability of the table has changed throughout versions of this app, and the MVP version removes essentially all of the data to be replaced with the Last Bid, No Bids, and Last Sales Price field. In lieu of deleting these fields, which may retain their usefulness at some point in the future, I have commented them out, so that they may be used when they prove useful. If you still have your code editor set to horizontal scrolling, than all I can say is git gud.
//

interface Data {
  '#': string;
  image: any;
  network: any;
  // token: string;
  // '24Hr': any;
  // '7d': any;
  // marketcap: string;
  // volume: string;
  // supply: string;
  // last7days: any;
  lastbid: string;
  nobids: string;
  lastsale: string;
  timestamp: any;
  trade: any;
}

interface TProps {
  domain: string;
  gridView: boolean;
  search: string;
}

const TableViewGlobal: FC<TProps> = ({ domain: _domain, gridView, search }) => {
  const context = useWeb3React<Web3Provider>();

  const { account } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { name } = domainContext;
  const history = useHistory();

  //
  // Following functions generate random numbers to display mock data in the UI
  //

  const randThreeS = () => {
    let temp =
      Math.random() > 0.5
        ? Math.floor(Math.random() * 1000).toString()
        : Math.floor(Math.random() * 100).toString();
    if (temp === '0') {
      temp = '10';
    }
    return temp;
  };

  const randThree = () => {
    let temp = Math.floor(Math.random() * 1000).toString();
    if (temp.length === 1) {
      temp = '00' + temp;
    }
    if (temp.length === 2) {
      temp = '0' + temp;
    }
    return temp;
  };

  const randVol = () => {
    let temp =
      (Math.floor(Math.random() * 99) + 1).toString() +
      ',' +
      randThree() +
      ',' +
      randThree();
    return temp;
  };

  const randPrice = () => {
    let temp = Math.floor(Math.random() * 100).toString();
    let dot = Math.floor(Math.random() * 100).toString();
    if (dot.length === 1) {
      dot = '0' + dot;
    }
    let up = Math.random() > 0.3;
    let price = `${up ? '▲' : '▼'} ${temp}.${dot}%`;
    return (
      <div style={{ color: `${up ? '#27AE60' : '#EB5757'}` }}>{price}</div>
    );
  };

  const randTrade = () => {
    let digits = Math.random() > 0.5;
    let temp;
    digits
      ? (temp =
          (Math.floor(Math.random() * 2) + 1).toString() + ',' + randThree())
      : (temp = randThreeS());
    let dec = Math.floor(Math.random() * 100).toString();
    if (dec.length === 1) {
      dec = '0' + dec;
    }
    return '$' + temp + '.' + dec;
  };

  const randGraph = () => {
    let temp = Math.floor(Math.random() * 10);
    if (temp === 0 || temp === 1) {
      return graph1;
    } else if (temp === 2 || temp === 3) {
      return graph2;
    } else if (temp === 4 || temp === 5) {
      return graph3;
    } else if (temp === 6 || temp === 7) {
      return graph4;
    } else if (temp === 8 || temp === 9) {
      return graph5;
    } else return graph5;
  };

  //
  //
  //

  const dataInput: Data[] = useMemo(
    () =>
      name.isNothing()
        ? []
        : _.map(name.value.subdomains, (key, i) => ({
            '#': (i + 1).toString(),
            // asset: <Profile domain={key} />,
            image: <Image />,
            network: key.name,
            // token: key + ' token',
            // '24Hr': randPrice(),
            // '7d': randPrice(),
            // marketcap: `$${randThreeS()},${randThree()},${randThree()}`,
            // volume: '$' + randVol(),
            // supply: `${randThreeS()},${randThree()},${randThree()} TICK`,
            // last7days: <img src={randGraph()} alt="" />,
            lastbid: '',
            nobids: '',
            lastsale: '',
            timestamp: '',
            trade: (
              <FutureButton style={{ height: 24 }}>{randTrade()}</FutureButton>
            ),
          })),
    [name],
  );

  const data = useMemo<Data[]>(() => dataInput, [dataInput]);

  const columns = useMemo<Column<Data>[]>(
    () => [
      {
        Header: <div>#</div>,
        accessor: '#',
      },
      {
        Header: 'Name',
        accessor: 'image',
      },
      { Header: '', accessor: 'network' },
      // { Header: 'Token', accessor: 'token' },
      // { Header: '24Hr', accessor: '24Hr' },
      // { Header: '7d', accessor: '7d' },
      // {
      //   Header: (
      //     <div className="infoHeader">
      //       <span>Market Cap </span>
      //       <span className="infoButton">
      //         <span className="infoMark">?</span>
      //       </span>
      //     </div>
      //   ),

      //   accessor: 'marketcap',
      // },
      // {
      //   Header: (
      //     <div className="infoHeader">
      //       <span>Volume </span>
      //       <span className="infoButton">
      //         <span className="infoMark">?</span>
      //       </span>
      //     </div>
      //   ),
      //   accessor: 'volume',
      // },
      // {
      //   Header: (
      //     <div className="infoHeader">
      //       <span>Supply </span>
      //       <span className="infoButton">
      //         <span className="infoMark">?</span>
      //       </span>
      //     </div>
      //   ),
      //   accessor: 'supply',
      // },
      // {
      //   Header: 'Last 7 Days',
      //   accessor: 'last7days',
      // },
      {
        Header: '',
        accessor: 'lastbid',
      },
      {
        Header: '',
        accessor: 'nobids',
      },
      {
        Header: '',
        accessor: 'lastsale',
      },
      {
        Header: 'Trade',
        accessor: 'trade',
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
    history.push({
      pathname: row.values.network,
    });
  };
  if (name.isNothing()) return null;

  return (
    <div className="shiftTableUp">
      <SearchTable globalFilter={search} setGlobalFilter={setGlobalFilter} />
      {!gridView ? (
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
            {/*console.log('ROWS', rows)*/}
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
                  <div
                    style={{
                      color: '#fff',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      marginTop: 20,
                      paddingBottom: 30,
                    }}
                  >
                    Nothing to see here!
                  </div>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      ) : (
        <Grid domain={_domain} />
      )}
    </div>
  );
};

export default TableViewGlobal;
