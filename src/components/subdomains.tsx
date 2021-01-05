import React, { FC, useCallback, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Link } from 'react-router-dom';
import { useZnsContracts } from '../lib/contracts';
import { useDomainCache } from '../lib/useDomainCache';
import Transfer from './transferDomains';

interface SubdomainsProps {
  domain: string;
}

const Subdomains: FC<SubdomainsProps> = ({ domain: _domain }) => {
  const context = useWeb3React<Web3Provider>();
  const contracts = useZnsContracts();
  const { library, account, active, chainId } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain, refetchDomain } = domainContext;
  const [input, setInput] = useState<string>();
  const onChange = useCallback((ev: any) => {
    setInput(ev.target.value);
  }, []);
  console.log(account, domain.isJust() && domain.value.owner);
  // TODO: form validation!
  const _onClick = useCallback(() => {
    if (input && account && contracts.isJust())
      contracts.value.registrar
        .createDomain(
          _domain === '_root' ? input : _domain + '.' + input,
          account,
          account,
          'some ref',
        )
        .then((txr) => txr.wait(1))
        .then(() => {
          refetchDomain();
        });
  }, [contracts, account, input]);

  if (domain.isNothing()) return <p>Loading</p>;
  return (
    <>
      {account?.toLowerCase() === domain.value.owner.toLowerCase() ? (
        <>
          {'wtf ?'}
          <Transfer domainId={domain.value.id} domainContext={domainContext} />
        </>
      ) : null}
      {/* <Form
        onSubmit={_onClick}
        validate={composeValidator({
          ref: (_ref: string) => undefined,
          subdomain: subdomainValidator,
        })}
        render={({ handleSubmit, invalid }) => (
          <form onSubmit={handleSubmit}>
            <Field name="subdomain">
              {({ input, meta }) => {
                return (
                  <div>
                    <button type="submit" onClick={_onClick} disabled={invalid}>
                      Create
                    </button>
                    <input onChange={onChange} placeholder="create subdomain" />
                    {meta.error && meta.error.subdomain && meta.error.subdomain}
                  </div>
                );
              }}
            </Field>
          </form>
        )}
      /> */}
      <Link to={'/' + domain.value.domain.replace(/\./, '/')}>
        Domain: {domain.value.domain}
      </Link>
      <div>
        Children:
        {domain.value.children.map((child) => (
          <div key={child}>
            <Link to={'/' + child.replace(/\./, '/')}>{child}</Link>
          </div>
        ))}
      </div>
      <div>Owner: {domain.value.owner}</div>
    </>
  );
};

export default Subdomains;
