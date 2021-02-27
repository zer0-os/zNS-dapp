import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { getAddress } from '@ethersproject/address';
import { useZnsContracts } from '../../../lib/contracts';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Domain, zeroAddress } from '../../../lib/useDomainStore';
import { hexRegex } from '../../../lib/validation/validators';
import { useDomainCache } from '../../../lib/useDomainCache';
import Transfer from '../../transferDomains';
import { Table, Tag, Space } from 'antd';

const { Column, ColumnGroup } = Table;

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

  console.log('APPROVAL', incomingApprovals);

  const dataInput: NfData[] = useMemo(
    () =>
      incomingApprovals.isNothing()
        ? []
        : incomingApprovals.value.map((domain) => ({
            // asset: <Profile domain={key} />,
            NFT: domain.domain,
            Owner: domain.owner,
            Offer: '$1,234.56',
            Date: '1 sept 2020',
          })),
    [contracts, account, refetchOwned, refetchIncomingApprovals],
  );

  // const claimBtn = () => {
  //   if (incomingApprovals.isJust()) return incomingApprovals.value.map((domain) => (
  //     <button onClick={() => _claim(domain)} key={domain.domain}>
  //       {' '}
  //       Claim Domain
  //     </button>
  //   ))}
  // }

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
        <Table dataSource={dataInput} style={{ backgroundImage: 'none' }}>
          <Column title="NFT" dataIndex="NFT" key="NFT" />
          <Column title="Owner" dataIndex="Owner" key="Owner" />

          <Column title="Offer" dataIndex="Offer" key="Offer" />
          <Column title="Date" dataIndex="Date" key="Date" />
          <Column
            title={null}
            key="action"
            render={(domain: Domain) => (
              <button onClick={() => _claim(domain)} key={domain.domain}>
                {' '}
                cLAIM
              </button>
            )}
          />
          <Column
            title={null}
            key="action"
            render={(domain: Domain) => (
              <button onClick={() => _revoke(domain)} key={domain.domain}>
                {' '}
                revoke
              </button>
            )}
          />
        </Table>
      </div>
    </>
  );
};

export default Claims;
