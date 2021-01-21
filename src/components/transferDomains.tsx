import React, { useCallback, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { getAddress } from '@ethersproject/address';
import { useZnsContracts } from '../lib/contracts';
import * as z from 'zod';
import { zodResolver } from '../lib/validation/zodResolver';
import { useForm } from 'react-hook-form';
import { DomainContext } from '../lib/useDomainStore';
import { hexRegex } from '../lib/validation/validators';

interface TransferProps {
  domainId: string;
  domainContext: DomainContext;
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

  const _transfer = useCallback(
    (address: string) => {
      if (
        account &&
        contracts.isJust() &&
        domain.isJust() &&
        account === domain.value.owner
      )
        contracts.value.registrar
          .transferFrom(account, address, domain.value.id)
          .then((txr: any) => txr.wait(1))
          .then(() => {
            refetchDomain();
          });
    },
    [contracts, account, domain],
  );

  if (domain.isNothing() || domain.value.owner !== account) return null;

  return (
    <form onSubmit={handleSubmit(({ address }) => _transfer(address))}>
      <div>
        <button type="submit"> Transfer Domain</button>
        <input name={'address'} ref={register} placeholder="receiver address" />
      </div>
    </form>
  );
};

export default Transfer;
