import React, { FC } from "react";
import { useDomainCache } from "../lib/useDomainCache";

const Domains: FC<{}> = () => {
  const { getDomain, state } = useDomainCache();
  const { domain, refetchDomain } = getDomain("_root");
  if (domain.isNothing())
    return <p>Loading</p>;
  return (
    <>
      <p>Domain: {domain.value.domain}</p>
      <p>
        Children:
        {domain.value.children.map((child) => (
          <p>{child}</p>
        ))}
      </p>
      <p>Owner:{domain.value.owner}</p>
    </>
  );
};

export default Domains;
