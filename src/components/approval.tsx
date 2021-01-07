import React, { Children, FC, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getAddress } from '@ethersproject/address';
import * as z from 'zod';
import { zodResolver } from '../lib/validation/zodResolver';
import { ethers, utils, BigNumberish } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useZnsContracts } from '../lib/contracts';
import { DomainContext, DomainStoreContext } from '../lib/useDomainStore';
import { hexRegex } from '../lib/validation/validators';

interface ApprovalProps {
  domainId: string;
  domainContext: DomainContext;
  domainStoreContext: DomainStoreContext;
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

const Approve: React.FC<ApprovalProps> = ({
  domainId: _domainId,
  domainContext,
  domainStoreContext,
}) => {
  const context = useWeb3React<Web3Provider>();
  const { account } = context;
  const contracts = useZnsContracts();
  const { domain, refetchDomain } = domainContext;
  const { refetchApprovedFrom, refetchApprovedTo } = domainStoreContext;
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
        contracts.value.registrar
          .approve(_domainId, address)
          .then((txr) => txr.wait(1))
          .then(() =>
            Promise.all([
              //TODO subgraph Approval!
              refetchDomain(),
              refetchApprovedFrom(),
              refetchApprovedTo(),
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
