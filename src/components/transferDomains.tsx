import React, { Children, FC, useCallback, useState } from "react";
import { ethers, utils, BigNumberish } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { useZnsContracts } from "../lib/contracts";
import { values } from "lodash";
import { useDomainCache } from "../lib/useDomainCache";

interface TransferProps {
  sender: string;
  receiver: string;
  domain_id: BigNumberish;
}

const Transfer: React.FC<TransferProps> = ({
  sender: _sender,
  receiver: _reveicer,
  domain_id: _domain_id,
}) => {
  const context = useWeb3React<Web3Provider>();
  const { account } = context;
  const contracts = useZnsContracts();
  //   const { useDomain } = useDomainCache();

  const _transfer = useCallback(() => {
    if (account && contracts.isJust())
      contracts.value.registrar
        .safeTransferFrom(_sender === account)
        .then((txr: { wait: (arg0: number) => any }) => txr.wait(1))
        .then(() => {
          return Transfer();
        });
  }, [contracts, account]);

  if (sender.isNothing()) return <p>Loading</p>;

  return <>l</>;
};

export default Transfer;
