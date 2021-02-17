import React, { FC, useState, useCallback, useMemo } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useZnsContracts } from '../../../lib/contracts';
import { useDomainCache } from '../../../lib/useDomainCache';
import { useDomainStore } from '../../../lib/useDomainStore';
import { Modal, Button, Tabs } from 'antd';
import Claim from '../shop/claims';
import Create from '../../table/create';
import Transfer from '../../transferDomains';
import Approve from '../../table/NFT-View/approval';
import { Link, useLocation } from 'react-router-dom';
import _ from 'lodash';
import TableImage from '.././../table/table-image';
import '../../css/profile.scss';
import Outgoing from './outGoingApproval';
import { Column, useTable, useFlexLayout } from 'react-table';

const { TabPane } = Tabs;

interface ShopProps {
  domain: string;
}

interface NFTRowProps {
  id: number;
  domain: string;
}
interface NFTColumnProps {
  key: number;
  name: string;
}

interface NftData {
  '#': string;
  NFT: any;
  Owner: string;
  Offer: string;
  Date: string;
}

const Shop: FC<ShopProps> = ({ domain: _domain }) => {
  const [isShopVisible, setShopVisible] = useState(false);
  const [outgoingPendingCount, setOutgoingPendingCount] = useState(0);
  const [size, setSize] = useState();
  const context = useWeb3React<Web3Provider>();
  const contracts = useZnsContracts();
  const { library, account, active, chainId } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
  const { owned, incomingApprovals } = useDomainStore();
  const location = useLocation();

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

  const outgoingApprovals = owned.isJust()
    ? owned.value.filter((control) => {
        return control.approval.isJust();
      })
    : null;

  const showShop = () => {
    setShopVisible(true);
  };

  const shopOk = () => {
    setShopVisible(false);
  };

  const shopCancel = () => {
    setShopVisible(false);
  };

  const dataInput: NftData[] = useMemo(
    () =>
      domain.isNothing()
        ? []
        : _.map(domain.value.owner, (key, i) => ({
            '#': i.toString(),
            // asset: <Profile domain={key} />,
            NFT: 'n/a',
            Owner: 'n/a',
            Offer: 'N/A',
            Date: 'N/A',
          })),
    [domain],
  );

  const data = useMemo<NftData[]>(() => dataInput, [dataInput]);
  const columns = React.useMemo<Column<NftData>[]>(
    () => [
      {
        Header: '#',
        accessor: '#',
      },
      {
        Header: 'NFT',
        accessor: 'NFT',
      },
      {
        Header: 'Owner',
        accessor: 'Owner',
      },

      {
        Header: 'Offer',
        accessor: 'Offer',
      },
      {
        Header: 'Date',
        accessor: 'Date',
      },
    ],
    [],
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  const gridCell = () => {
    return (
      <div className="Cellgrid">
        <div className="Topcell"> DOMAIN DATA </div>
        <div className="Bottomcell">
          <div className="TextTopcell"></div>
          <div className="TextMiddlecell">ticker</div>
          <div className="TextBottomcell">
            <span>Left</span>
            <span>Right</span>
          </div>
        </div>
      </div>
    );
  };

  const cells: any = [];
  cells.push(gridCell());
  cells.push(gridCell());
  cells.push(gridCell());
  cells.push(gridCell());
  cells.push(gridCell());
  cells.push(gridCell());
  cells.push(gridCell());
  cells.push(gridCell());
  if (owned.isNothing() && domain.isNothing()) return null;
  return (
    <>
      {owned.isJust() && (
        <button className="btn-shop" onClick={showShop}>
          Shop
        </button>
      )}
      <Modal
        style={{
          position: 'relative',
          margin: 0,
          padding: 0,
          background: '#E5E5E5',
        }}
        bodyStyle={{ height: '90vh', background: '#69038D' }}
        closeIcon={null}
        width={'400vw'}
        centered
        visible={isShopVisible}
        onOk={shopOk}
        onCancel={shopCancel}
        footer={null}
      >
        <Tabs
          defaultActiveKey="1"
          size={size}
          style={{ marginBottom: 32, overflow: 'auto', background: '#69038D' }}
          tabPosition={'left'}
        >
          <TabPane
            tab="NFTs You Own"
            key="1"
            style={{ overflow: 'auto', height: '80vh' }}
          >
            <div className="gridContainer-profile">{cells}</div>
            {/* <div>
              {owned.value.map((control) => {
                return (
                  <div key={control.domain}>
                    <Link
                      to={'/' + control.domain}
                      //   key={control.domain}
                    >
                      {control.domain}
                    </Link>
                  </div>
                );
              })}
            </div>{' '} */}
          </TabPane>

          <TabPane tab="NFTs You've Made" key="3">
            <div className="listOut">
              <div className="gridContainer-profile">{cells}</div>
            </div>
          </TabPane>
          <TabPane
            tab="Offers You've Made"
            key="2"
            style={{ overflow: 'auto', height: '80vh' }}
          >
            <div>
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
                          <tr>
                            {
                              // Loop over the rows cells
                              row.cells.map((cell) => {
                                // Apply the cell props
                                return (
                                  <td
                                    className="tdGlobal"
                                    {...cell.getCellProps()}
                                  >
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
                </table>
              </div>
              <br />
              <br />
            </div>
          </TabPane>
          <TabPane tab="Offers Made To You" key="4">
            <div>
              <h1>
                Incoming Approvals:{' '}
                {incomingApprovals.isJust()
                  ? incomingApprovals.value.length
                  : 0}{' '}
              </h1>
            </div>

            <div>
              <Claim />
            </div>
          </TabPane>
        </Tabs>
      </Modal>
    </>
  );
};
export default Shop;
