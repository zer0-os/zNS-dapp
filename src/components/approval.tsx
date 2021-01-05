import React, { Children, FC, useCallback, useState } from 'react';
import { ethers, utils, BigNumberish } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { Form, Field } from 'react-final-form';
import { Web3Provider } from '@ethersproject/providers';
import { useZnsContracts } from '../lib/contracts';
import { values } from 'lodash';
import { useDomainCache } from '../lib/useDomainCache';
import { send } from 'q';

interface ApprovalProps {
  domain_id: BigNumberish;
  domain: string;
}

const Approve: React.FC<ApprovalProps> = ({
  domain_id: _domain_id,
  domain: _domain,
}) => {
  const context = useWeb3React<Web3Provider>();
  const { account } = context;
  const contracts = useZnsContracts();
  const { useDomain } = useDomainCache();
  const { domain, refetchDomain } = useDomain(_domain);
  const { controlled } = useDomainCache();

  const [to, setTo] = useState('');

  const _approve = useCallback(() => {
    if (account && contracts.isJust() && account != to) {
      contracts.value.registrar
        .approve(to, _domain_id)
        .then((txr) => txr.wait(1))
        .then(() => {
          refetchDomain();
        });
    }
  }, [contracts, account]);

  if (
    controlled.isNothing() ||
    domain.isNothing() ||
    domain.value.owner != account
  )
    return null;

  return (
    <>
      <Form onSubmit={_approve} />
    </>
  );
};

export default Approve;
