import React, { useCallback, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useZnsContracts } from '../lib/contracts';
import * as z from 'zod';
import { zodResolver } from '../lib/validation/zodResolver';
import { useForm } from 'react-hook-form';
import { DomainContext } from '../lib/useDomainStore';
import { subdomainRegex } from '../lib/validation/validators';

interface CreateProps {
  domainId: string;
  domainContext: DomainContext;
}

const schema = z.object({
  child: z
    .string()
    .regex(subdomainRegex, 'Subdomain must only contain alphanumeric letters')
});

const Create: React.FC<CreateProps> = ({ domainId, domainContext }) => {
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
        <button type="submit"> Create Domain</button>
        <input name={'child'} ref={register} placeholder="child domain" />
      </div>
    </form>
  );
};

export default Create;
