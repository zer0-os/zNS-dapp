import React, { Children, FC, useCallback, useState } from "react";
import { ethers, utils, BigNumberish } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { useZnsContracts } from "../lib/contracts";
import { useDomainCache } from "../lib/useDomainCache";
import { reject } from "lodash";

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

  const _transfer = useCallback(() => {
    if (account && contracts.isJust())
      contracts.value.registrar
        .safeTransferFrom(
          contracts.value.signer === account ? Transfer : reject
        )
        .then((txr: any) => txr.wait(1))
        .then(() => {
          refetchDomain();
        });
  }, [contracts, account]);

  if (domain.isNothing()) return <p>Loading</p>;

  return <>l</>;
};

export default Transfer;
