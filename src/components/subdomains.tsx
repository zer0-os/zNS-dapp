import React, { Children, FC, useCallback, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useZnsContracts } from "../lib/contracts";
import { useDomainCache } from "../lib/useDomainCache";
import { Form, Field } from "react-final-form";
interface SubdomainsProps {
  domain: string;
}

interface validations {
  message: string;
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

  const required = (v: string) => {
    if (!v || v === "") {
      return "required please pass in a domain";
    }

    return undefined;
  };
  const forbidenName = (v: string) => {
    if (v === "_root" || "ROOT" || "*root") {
      return "forbiden name please try again";
    }

    return undefined;
  };

  const pattern = (v: string) => {
    if (v != v.toLowerCase()) {
      return "all domains must be lower case";
    }
    return undefined;
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

  if (domain.isNothing()) return <p>Loading</p>;

  return (
    <Form
      onSubmit={_onClick}
      render={({ handleSubmit, invalid }) => (
        <form onSubmit={handleSubmit}>
          <Field
            name="subdomain"
            validate={composeValidators(required, pattern, forbidenName)}
          >
            {({ input, meta }) => (
              <div>
                <button type="submit" onClick={_onClick} disabled={invalid}>
                  Create subdomain
                </button>
                <input onChange={onChange} placeholder="create subdomain" />
                {meta.error && meta.touched && <span>{meta.error}</span>}
              </div>
            )}
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

const composeValidators = (
  ...validators: {
    (v: string): "required please pass in a domain" | undefined;
    (v: string): "All domains must be lower case" | undefined;
    (v: string): "Forbiden name please try again" | undefined;
  }[]
) => (value: string) =>
  validators.reduce(
    (error, validator) => (error as any) || validator(value),
    undefined
  );

export default Subdomains;
