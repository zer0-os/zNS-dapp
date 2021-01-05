import React, { Children, FC, useCallback, useEffect, useState } from 'react';
import { ethers, utils, BigNumberish } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { getAddress } from '@ethersproject/address';
import { useZnsContracts } from '../lib/contracts';
import { useDomainCache } from '../lib/useDomainCache';
import * as z from 'zod';
import { zodResolver } from '../lib/validation/zodResolver';
import { useForm } from 'react-hook-form';
import { DomainContext } from '../lib/useDomainStore';
import { subdomainRegex } from '../lib/validation/validators';

interface TransferProps {
  domainId: string;
  domainContext: DomainContext;
}

const schema = z.object({
  child: z
    .string()
    .regex(subdomainRegex, 'Subdomain must only contain alphanumeric letters')
});

const Transfer: React.FC<TransferProps> = ({ domainId, domainContext }) => {
  const { refetchDomain, domain } = domainContext;
  const { register, handleSubmit, errors } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  // TODO: show user what they're doing wrong
  useEffect(() => console.log(errors), [errors]);
  const context = useWeb3React<Web3Provider>();
  const { account } = context;
  const contracts = useZnsContracts();

  const _create = useCallback((child: string) => {
    if (account && contracts.isJust() && domain.isJust())
      contracts.value.registrar
        .createDomain(
          domain.value.domain === '_root' ? child : domain.value.domain + '.' + child,
          account,
          account,
          'some ref',
        )
        .then((txr) => txr.wait(1))
        .then(() => {
          refetchDomain();
        });
  }, [contracts, account]);

  if (domain.isNothing() || domain.value.owner !== account) return null;

  return (
    <form onSubmit={handleSubmit(({ child }) => _create(child))}>
      <div>
        <button type="submit"> Transfer Domain</button>
        <input name={'address'} ref={register} placeholder="receiver address" />
      </div>
    </form>
  );
};

export default Transfer;
