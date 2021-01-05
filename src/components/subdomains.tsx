import React, { Children, FC, useCallback, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { Form, Field } from "react-final-form";
import { composeValidator } from "../lib/validation/form-validation";
import { subdomainValidator } from "../lib/validation/validators";
import { useZnsContracts } from "../lib/contracts";
import { useDomainCache } from "../lib/useDomainCache";
interface SubdomainsProps {
  domain: string;
}

const Subdomains: FC<SubdomainsProps> = ({ domain: _domain }) => {
  const context = useWeb3React<Web3Provider>();
  const contracts = useZnsContracts();
  const { library, account, active, chainId } = context;
  const { useDomain } = useDomainCache();
  const { domain, refetchDomain } = useDomain(_domain);
  const [input, setInput] = useState<string>();
  const onChange = (ev: any) => {
    setInput(ev.target.value);
  };

  // TODO: form validation!
  const _onClick = useCallback(() => {
    if (input && account && contracts.isJust())
      contracts.value.registrar
        .createDomain(
          _domain === "_root" ? input : _domain + "." + input,
          account,
          account,
          "some ref"
        )
        .then((txr) => txr.wait(1))
        .then(() => {
          refetchDomain();
        });
  }, [contracts, account, input]);

  if (domain.isNothing() || domain.value.owner != account) return null;

  return (
    <Form
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

          <div className="domains">Domain: {domain.value.domain}</div>
          <div className="subdomains">
            Subdomains:
            {domain.value.children.map((child) => (
              <li key={child}>{child}</li>
            ))}
          </div>
        </form>
      )}
    />
  );
};

export default Subdomains;
