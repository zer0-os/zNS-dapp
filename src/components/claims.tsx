import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { getAddress } from '@ethersproject/address';
import { useZnsContracts } from '../lib/contracts';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { DomainContext } from '../lib/useDomainStore';
import { hexRegex } from '../lib/validation/validators';
import { useDomainCache } from '../lib/useDomainCache';
import Transfer from './transferDomains';
import { zeroAddress } from '../lib/useDomainStore';

interface ClaimProps {
  domain: string;
}

const Claim: React.FC<ClaimProps> = ({ domain: _domain }) => {
  const context = useWeb3React<Web3Provider>();
  const { account } = context;
  const contracts = useZnsContracts();
  const domainStore = useDomainCache();
  const { useDomain } = domainStore;
  const { domain, refetchDomain } = useDomain(_domain);
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

  const _revoke = useCallback(
    (address: string) => {
      if (
        account &&
        contracts.isJust() &&
        domain.isJust() &&
        account != address
      )
        contracts.value.registry
          .approve(zeroAddress, domain.value.id)
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
      <div className="create-button">
        <button
          onSubmit={handleSubmit(({ account }) => _claim(account))}
          type="submit"
          name={'address'}
          ref={register}
        >
          {' '}
          Claim Domain
        </button>

        <button
          onSubmit={handleSubmit(({ account }) => _revoke(account))}
          type="submit"
          name={'address'}
          ref={register}
        >
          {' '}
          Revoke
        </button>
      </div>
    </>
  );
};

export default Claim;
