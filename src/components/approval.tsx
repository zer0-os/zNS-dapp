import React, { Children, FC, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getAddress } from '@ethersproject/address';
import * as z from 'zod';
import { zodResolver } from '../lib/validation/zodResolver';
import { ethers, utils, BigNumberish } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useZnsContracts } from '../lib/contracts';
import { useDomainCache } from '../lib/useDomainCache';
import { hexRegex } from '../lib/validation/validators';

interface ApprovalProps {
  domainId: string;
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

const Approve: React.FC<ApprovalProps> = ({
  domainId: _domainId,
  domain: _domain,
}) => {
  const context = useWeb3React<Web3Provider>();
  const { account } = context;
  const contracts = useZnsContracts();
  const { useDomain } = useDomainCache();
  const { domain, refetchDomain } = useDomain(_domain);
  const { controlled } = useDomainCache();
  const { register, handleSubmit, errors } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const _approve = useCallback(
    (address: string) => {
      if (account && contracts.isJust() && account != address) {
        contracts.value.registrar
          .approve(_domainId, address)
          .then((txr) => txr.wait(1))
          .then(() => {
            refetchDomain();
          });
      }
    },
    [contracts, account],
  );

  if (
    controlled.isNothing() ||
    domain.isNothing() ||
    domain.value.owner != account
  )
    return null;

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
