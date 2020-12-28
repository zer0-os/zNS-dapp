import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import React, { FC, useCallback, useState } from "react";
import { useZnsContracts } from "../lib/contracts";
import { useDomainCache } from "../lib/useDomainCache";

interface SubdomainsProps {
  domain: string;
}

const Subdomains: FC<SubdomainsProps> = ({ domain: _domain }) => {
  const context = useWeb3React<Web3Provider>();
  const contracts = useZnsContracts();
  const { library, account, active, chainId } = context;
  const { getDomain, state } = useDomainCache();
  const { domain, refetchDomain } = getDomain(_domain);
  const [input, setInput] = useState<string>();
  const onChange = (ev: any) => {
    console.log("wtf", ev.target.value, input);
    setInput(ev.target.value);
  };
  // TODO: form validation!
  const onClick = useCallback(() => {
    if (input && account)
      contracts
        .unsafelyUnwrap()
        .registrar.createDomain(
          _domain === "_root" ? input : _domain + "." + input,
          account,
          account,
          "some ref"
        )
        .then((txr) => txr.wait(1))
        .then(() => {
          console.log("confirmed!");
          refetchDomain();
        });
  }, [contracts, account, input]);
  if (domain.isNothing()) return <p>Loading</p>;
  return (
    <>
      {account && account.toLowerCase() == domain.value.owner.toLowerCase() && (
        <div>
          <button onClick={onClick}>Create subdomain</button>
          <input onChange={onChange} placeholder={"create subdomain"} />
        </div>
      )}
      <div>Domain: {domain.value.domain}</div>
      <div>
        Children:
        {domain.value.children.map((child) => (
          <div>{child}</div>
        ))}
      </div>
      <div>Owner:{domain.value.owner}</div>
    </>
  );
};

export default Subdomains;
