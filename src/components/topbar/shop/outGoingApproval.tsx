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
import { indexOf } from 'lodash';
import { Space, Table } from 'antd';
const { Column, ColumnGroup } = Table;

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
    [owned, refetchOwned],
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
    [domain, refetchOwned, account],
  );

  const data = useMemo<NftData[]>(() => dataInput, [dataInput, account]);
  // const columns = React.useMemo<Column<NftData>[]>(
  //   () => [
  //     {
  //       Header: 'NFT',
  //       accessor: 'NFT',
  //     },
  //     {
  //       Header: 'Owner',
  //       accessor: 'Owner',
  //     },

  //     {
  //       Header: 'Offer',
  //       accessor: 'Offer',
  //     },
  //     {
  //       Header: 'Date',
  //       accessor: 'Date',
  //     },
  //   ],
  //   [account],
  // );

  if (owned.isNothing()) return null;

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

      <Table dataSource={dataInput} style={{}}>
        <Column title="NFT" dataIndex="NFT" key="NFT" />
        <Column title="Owner" dataIndex="Owner" key="Owner" />

        <Column title="Offer" dataIndex="Offer" key="Offer" />
        <Column title="Date" dataIndex="Date" key="Date" />
        <Column
          title={null}
          key="action"
          render={(text, record) => (
            <Space size="middle">
              <a>Revoke </a>
            </Space>
          )}
        />
      </Table>
    </>
  );
};

export default Outgoing;
