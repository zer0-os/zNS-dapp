import React, { Children, FC, useCallback, useState } from "react";
import { ethers, utils, BigNumberish } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { useZnsContracts } from "../lib/contracts";
import { useDomainCache } from "../lib/useDomainCache";
import { Field, Form } from "react-final-form";

interface TransferProps {
  domain: string;
  receiver: string;
  domain_id: BigNumberish;
}

const Transfer: React.FC<TransferProps> = ({
  receiver: _reveicer,
  domain_id: _domain_id,
  domain: _domain,
}) => {
  const context = useWeb3React<Web3Provider>();
  const { account } = context;
  const contracts = useZnsContracts();
  const { useDomain } = useDomainCache();
  const { domain, refetchDomain } = useDomain(_domain);
  const [input, setInput] = useState<string>();
  const onChange = (ev: any) => {
    setInput(ev.target.value);
  };

  const _transfer = useCallback(() => {
    if (input && account && contracts.isJust() && account === _domain)
      contracts.value.registrar
        .safeTransferFrom(account, _reveicer)
        .then((txr: any) => txr.wait(1))
        .then(() => {
          refetchDomain();
        });
  }, [contracts, account]);

  if (domain.isNothing() || domain.value.owner != account) return null;

  return (
    <Form
      onSubmit={_transfer}
      render={({ handleSubmit }) => <form onSubmit={handleSubmit}>
          <Field 
      </form>}
    />
  );
};

export default Transfer;
