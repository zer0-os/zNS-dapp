import React, { Children, FC, useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getAddress } from '@ethersproject/address';
import * as z from 'zod';
import { zodResolver } from '../../../lib/validation/zodResolver';
import { ethers, utils, BigNumberish } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useZnsContracts } from '../../../lib/contracts';
import {
  DomainContext,
  IncomingApprovalsContext,
} from '../../../lib/useDomainStore';
import { hexRegex } from '../../../lib/validation/validators';
import { useDomainCache } from '../../../lib/useDomainCache';
import { zeroAddress } from '../../../lib/useDomainStore';
import { Domain } from '../../../lib/useDomainStore';
import Approve from '../../table/NFT-View/approval';
import { domain } from 'process';
import { Column, useTable } from 'react-table';
import { indexOf } from 'lodash';

interface NFTRowProps {
  id: number;
  domain: string;
}
interface NFTColumnProps {
  key: number;
  name: string;
}

interface NftData {
  NFT: any;
  Owner: string;
  Offer: string;
  Date: string;
}

const Outgoing: React.FC = () => {
  const context = useWeb3React<Web3Provider>();
  const { account } = context;
  const contracts = useZnsContracts();
  const domainStore = useDomainCache();
  const { owned, refetchOwned } = domainStore;

  const outgoingData = useMemo(
    () =>
      owned.isNothing() ? [] : owned.value.filter((d) => d.approval.isJust()),
    [owned],
  );

  const _revoke = useCallback(
    (domain: Domain) => {
      if (account && contracts.isJust())
        contracts.value.registry
          .approve(zeroAddress, domain.id)
          .then((txr: any) => txr.wait(2))
          .then(() => {
            refetchOwned();
          });
    },
    [contracts, account, refetchOwned],
  );

  const dataInput: NftData[] = useMemo(
    () =>
      owned.isNothing()
        ? []
        : owned.value.map((domain) => ({
            // asset: <Profile domain={key} />,
            NFT: domain.domain,
            Owner: domain.owner,
            Offer: '$1,234.56',
            Date: '1 sept 2020',
          })),
    [domain],
  );

  const data = useMemo<NftData[]>(() => dataInput, [dataInput]);
  const columns = React.useMemo<Column<NftData>[]>(
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

  const getRowId = React.useCallback((row) => {
    return row.id;
  }, []);

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
  if (owned.isNothing()) return null;

  return (
    <>
      {/* <div className="outgoing">
        {owned.value.map((domain) => (
          <div key={domain.domain}>{domain.domain}</div>
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

export default Outgoing;
