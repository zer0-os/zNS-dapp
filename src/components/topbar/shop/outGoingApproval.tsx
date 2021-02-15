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
  if (owned.isNothing()) return null;

  return (
    <>
      <div className="outgoing">
        {owned.value.map((domain) => (
          <div key={domain.domain}>{domain.domain}</div>
        ))}
      </div>
    </>
  );
};

export default Outgoing;
