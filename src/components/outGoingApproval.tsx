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
  domain: string;
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

const Outgoing: React.FC<ApprovalProps> = ({ domain: _domain }) => {
  const context = useWeb3React<Web3Provider>();
  const { account } = context;
  const contracts = useZnsContracts();
  const domainStore = useDomainCache();
  const { refetchIncomingApprovals, useDomain, refetchOwned } = domainStore;
  const { domain, refetchDomain } = useDomain(_domain);
  const { register, handleSubmit, errors } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const _outgoing = useCallback(
    (address: string) => {
      if (
        account &&
        contracts.isJust() &&
        domain.isJust() &&
        account === account
      )
        contracts.value.registry
          .transferFrom(account, domain.value.owner, domain.value.id)
          .then((txr: any) => txr.wait(1))
          .then(() => {
            refetchDomain();
          });
    },
    [contracts, account, domain],
  );

  if (domain.isNothing()) return null;

  return (
    <form onSubmit={handleSubmit(({ address }) => _outgoing(address))}>
      <div>
        <button type="submit">Send</button>
        <input name={'address'} ref={register} placeholder="your eth address" />
      </div>
    </form>
  );
};

export default Outgoing;
