import React, { Children, FC, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getAddress } from '@ethersproject/address';
import * as z from 'zod';
import { zodResolver } from '../lib/validation/zodResolver';
import { ethers, utils, BigNumberish } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useZnsContracts } from '../lib/contracts';
import { DomainContext, IncomingApprovalsContext } from '../lib/useDomainStore';
import { hexRegex } from '../lib/validation/validators';
import { useDomainCache } from '../lib/useDomainCache';

interface ApprovalProps {
  domainId: string;
  domainContext: DomainContext;
  incomingApprovals: IncomingApprovalsContext;
}

const schema = z.object({
  address: z
    .string()
    .regex(hexRegex, 'Address must be hex')
    .refine(
      (address) => {
        try {
          return address === getAddress(address);
        } catch (e) {
          return false;
        }
      },
      {
        message: 'Not checksummed address',
      },
    ),
});

const Approve: React.FC<ApprovalProps> = ({ domainId: _domainId }) => {
  const context = useWeb3React<Web3Provider>();
  const { account } = context;
  const contracts = useZnsContracts();
  const domainStore = useDomainCache();
  const { refetchIncomingApprovals, useDomain, refetchOwned } = domainStore;
  const { domain, refetchDomain } = useDomain(_domainId);
  const { register, handleSubmit, errors } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const _approve = useCallback(
    (address: string) => {
      if (
        account &&
        contracts.isJust() &&
        domain.isJust() &&
        account != address
      ) {
        contracts.value.registry
          .approve(_domainId, address)
          .then((txr) => txr.wait(1))
          .then(() =>
            Promise.all([
              refetchIncomingApprovals,
              refetchDomain,
              refetchOwned,
            ]),
          );
      }
    },
    [contracts, account, domain],
  );

  if (domain.isNothing() || domain.value.owner != account) return null;

  return (
    <form onSubmit={handleSubmit(({ address }) => _approve(address))}>
      <div>
        <button type="submit">Approve Address</button>
        <input name={'address'} ref={register} placeholder="approval address" />
      </div>
    </form>
  );
};

export default Approve;
