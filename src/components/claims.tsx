import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { getAddress } from '@ethersproject/address';
import { useZnsContracts } from '../lib/contracts';
import * as z from 'zod';

import { zodResolver } from '../lib/validation/zodResolver';
import { useForm } from 'react-hook-form';
import { DomainContext } from '../lib/useDomainStore';
import { hexRegex } from '../lib/validation/validators';
import { useDomainCache } from '../lib/useDomainCache';
import Transfer from './transferDomains';

interface ClaimProps {
  domainId: string;
  domainContext: DomainContext;
}

const schema = z.object({
  address: z
    .string()
    .regex(hexRegex, 'Address must be hex')
    .refine(
      (account) => {
        try {
          return account === getAddress(account);
        } catch (e) {
          return false;
        }
      },
      {
        message: 'Not checksummed address',
      },
    ),
});

const Claim: React.FC<ClaimProps> = ({ domainId, domainContext }) => {
  const { refetchDomain, domain } = domainContext;
  const context = useWeb3React<Web3Provider>();
  const { account } = context;
  const contracts = useZnsContracts();
  const { useDomain } = useDomainCache();
  const { register, handleSubmit, errors } = useForm();

  const _claim = useCallback(
    (address: string) => {
      if (
        account &&
        contracts.isJust() &&
        domain.isJust() &&
        domain.value.owner === domain.value.owner
      )
        contracts.value.registry
          .transferFrom(domain.value.owner, account, domain.value.id)
          .then((txr: any) => txr.wait(1))
          .then(() => {
            refetchDomain();
          });
    },
    [contracts, account, domain],
  );

  if (domain.isNothing() || domain.value.owner !== account) return null;

  return (
    <>
      <button style={{ color: 'white' }} className="owned-btn">
        Transfer domain
      </button>

      <form onSubmit={handleSubmit(({ account }) => _claim(account))}>
        <div className="create-button">
          <button type="submit"> Claim Domain</button>
          <input name={'account'} ref={register} placeholder="Claim Domain" />
        </div>
      </form>
    </>
  );
};

export default Claim;
