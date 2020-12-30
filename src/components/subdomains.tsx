import React, { FC, useCallback, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useZnsContracts } from "../lib/contracts";
import { useDomainCache } from "../lib/useDomainCache";
import { Form, Field } from "react-final-form";
import { FieldRenderProps } from "react-final-form";
import { formValidation } from "./form-validation";
import { useDomainStore } from "../lib/useDomainStore";
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
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log(input);
  };
  const onChange = (ev: any) => {
    setInput(ev.target.value);
  };

  // TODO: form validation!
  const onSubmit = useCallback(() => {
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
      onSubmit={(values) => {
        console.log(values);
      }}
      initialValues={{ setInput }}
      // validate={(values) => formValidation.validateForm(values)}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Field name="subdomain">
            {({ input }) => (
              <div>
                <>Domain: {domain.value.domain}</>
                <input type="text" onChange={(e) => setInput(e.target.value)} />
                <button onClick={onSubmit}>Create subdomain</button>

                <>
                  {domain.value.children.map((child) => (
                    <div>{child}</div>
                  ))}
                </>
              </div>
            )}
          </Field>
        </form>
      )}
    />
  );
};

export default Subdomains;
