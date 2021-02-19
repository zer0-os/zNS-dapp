import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { getAddress } from '@ethersproject/address';
import { useZnsContracts } from '../../../lib/contracts';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Domain } from '../../../lib/useDomainStore';
import { hexRegex } from '../../../lib/validation/validators';
import { useDomainCache } from '../../../lib/useDomainCache';
import Transfer from '../../transferDomains';
import { useTable, Column } from 'react-table';

interface NFRowProps {
  id: number;
  domain: string;
}
interface NFColumnProps {
  key: number;
  name: string;
}

interface NfData {
  NFT: any;
  Owner: string;
  Offer: string;
  Date: string;
}

const Claims: React.FC = () => {
  const context = useWeb3React<Web3Provider>();
  const { account } = context;
  const contracts = useZnsContracts();
  const domainStore = useDomainCache();
  const {
    incomingApprovals,
    refetchIncomingApprovals,
    refetchOwned,
  } = domainStore;

  const _claim = useCallback(
    (domain: Domain) => {
      if (account && contracts.isJust())
        contracts.value.registry
          .transferFrom(domain.owner, account, domain.id)
          .then((txr: any) => txr.wait(2))
          .then(() => {
            refetchIncomingApprovals();
            refetchOwned();
          });
    },
    [contracts, account, refetchOwned, refetchIncomingApprovals],
  );

  console.log('APPROVAL', incomingApprovals);

  const dataInput: NfData[] = useMemo(
    () =>
      incomingApprovals.isNothing()
        ? []
        : incomingApprovals.value.map((domain) => ({
            // asset: <Profile domain={key} />,
            NFT: 'n/a',
            Owner: 'n/a',
            Offer: '$1,234.56',
            Date: '1 sept 2020',
          })),
    [incomingApprovals],
  );

  const data = useMemo<NfData[]>(() => dataInput, [dataInput]);
  const columns = React.useMemo<Column<NfData>[]>(
    () => [
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

  if (incomingApprovals.isNothing()) return null;
  return (
    <>
      {/* <div className="create-button">
        {incomingApprovals.value.map((domain) => (
          <button onClick={() => _claim(domain)} key={domain.domain}>
            {' '}
            Claim Domain
          </button>
        ))}
      </div> */}
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
          </table>
        </div>
        <br />
        <br />
      </div>
    </>
  );
};

export default Claims;
