import React, { Children, FC, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getAddress } from '@ethersproject/address';
import * as z from 'zod';
import { zodResolver } from '../../../lib/validation/zodResolver';
import { ethers, utils, BigNumberish } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useZnsContracts } from '../../../lib/contracts';
import {
  DomainContext,
  IncomingApprovalsContext,
} from '../../../lib/useDomainStore';
import { hexRegex } from '../../../lib/validation/validators';
import { useDomainCache } from '../../../lib/useDomainCache';
import Modal from 'antd/lib/modal/Modal';
import { Domain } from 'domain';

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

const Approve: React.FC<ApprovalProps> = ({ domain: _domain }) => {
  const context = useWeb3React<Web3Provider>();
  const { account } = context;
  const contracts = useZnsContracts();
  const domainStore = useDomainCache();
  const { refetchIncomingApprovals, useDomain, refetchOwned } = domainStore;
  const [isTransferVisible, setTransferVisible] = useState(false);
  const { domain, refetchDomain } = useDomain(_domain);
  const { register, handleSubmit, errors } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const _approve = useCallback(
    (address: string) => {
      if (
        account &&
        contracts.isJust() &&
        domain.isJust() &&
        account != address &&
        account === domain.value.owner
      ) {
        contracts.value.registry
          .approve(address, domain.value.id)
          .then((txr) => {
            return txr.wait(2);
          })
          .then((txh) => {
            if (txh.status === 2) {
              alert('TX REJECTED');
            } else {
              alert('TX APPOVED');
            }
            Promise.all([
              refetchIncomingApprovals,
              refetchDomain,
              refetchOwned,
            ]);
          })
          .catch((e) => {
            console.log('error?', e);
            alert('TX ERROR');
          });
      }
    },
    [contracts, account, domain],
  );

  const showTransfer = () => {
    setTransferVisible(true);
  };

  const transferOk = () => {
    setTransferVisible(false);
  };

  const transferCancel = () => {
    setTransferVisible(false);
  };

  console.log('FIRE1');
  console.log('approval domain', domain);
  console.log(account);
  if (domain.isNothing() || domain.value.owner !== account) return null;
  console.log('FIRE2');
  return (
    <>
      <form onSubmit={handleSubmit(({ address }) => _approve(address))}>
        <div>
          <div>ETHEREUM ADDRESS TO TRANSFER TO</div>
          <button type="submit">Transfer</button>
          <input name={'address'} ref={register} placeholder="address" />
        </div>
      </form>
    </>
  );
};

export default Approve;
