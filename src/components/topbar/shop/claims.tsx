import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { getAddress } from '@ethersproject/address';
import { useZnsContracts } from '../../../lib/contracts';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Domain } from '../../../lib/useDomainStore';
import { hexRegex } from '../../../lib/validation/validators';
import { useDomainCache } from '../../../lib/useDomainCache';
import Transfer from '../../transferDomains';

const Claims: React.FC = () => {
  const context = useWeb3React<Web3Provider>();
  const { account } = context;
  const contracts = useZnsContracts();
  const domainStore = useDomainCache();
  const {
    incomingApprovals,
    refetchIncomingApprovals,
    refetchOwned,
  } = domainStore;

  const _claim = useCallback(
    (domain: Domain) => {
      if (account && contracts.isJust())
        contracts.value.registry
          .transferFrom(domain.owner, account, domain.id)
          .then((txr: any) => txr.wait(2))
          .then(() => {
            refetchIncomingApprovals();
            refetchOwned();
          });
    },
    [contracts, account, refetchOwned, refetchIncomingApprovals],
  );

  console.log('APPROVAL', incomingApprovals);

  if (incomingApprovals.isNothing()) return null;
  return (
    <>
      <div className="create-button">
        {incomingApprovals.value.map((domain) => (
          <button onClick={() => _claim(domain)} key={domain.domain}>
            {' '}
            Claim Domain
          </button>
        ))}
      </div>
    </>
  );
};

export default Claims;
