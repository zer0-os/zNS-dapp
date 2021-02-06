import React, { Children, FC, useCallback, useMemo, useState } from 'react';
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
import { zeroAddress } from '../lib/useDomainStore';
import Approve from './approval';

interface OutgoingProps {
  domain: string;
}

const Outgoing: React.FC<OutgoingProps> = ({ domain: _domain }) => {
  const context = useWeb3React<Web3Provider>();
  const { account } = context;
  const contracts = useZnsContracts();
  const domainStore = useDomainCache();
  const { incomingApprovals, useDomain, refetchOwned } = domainStore;
  const { domain, refetchDomain } = useDomain(_domain);
  const { register, handleSubmit, errors } = useForm();

  const outGoingData = useMemo(() => {
    // if ( domain.isJust() &&
    // incomingApprovals.isJust())
  }, [domain]);

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
  if (domain.isNothing()) return null;

  return (
    <>
      <div>
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

export default Outgoing;
