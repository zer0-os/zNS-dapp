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

  if (domain.isNothing() || domain.value.owner !== domain.value.owner)
    return null;

  return (
    <>
      <div className="create-button">
        <button
          onSubmit={handleSubmit(({ account }) => _claim(account))}
          type="submit"
        >
          {' '}
          Claim Domain
        </button>
      </div>
    </>
  );
};

export default Claim;
