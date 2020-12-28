import React, { FC } from "react";
import { useDomainCache } from "../lib/useDomainCache";

const Domains: FC<{}> = () => {
  const { getDomain, state } = useDomainCache();
  const { domain, refetchDomain } = getDomain("_root");
  if (!state || !state.domains || !state.domains["_root"])
    return <p>Loading</p>;
  return (
    <>
      <p>Domain: {state.domains["_root"].domain}</p>
      <p>
        Children:
        {state.domains["_root"].children.map((child) => (
          <p>{child}</p>
        ))}
      </p>
      <p>Owner:{state.domains["_root"].owner}</p>
    </>
  );
};

export default Domains;
