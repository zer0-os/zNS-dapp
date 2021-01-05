import React, { Children, FC, useCallback, useState } from "react";
import { ethers, utils, BigNumberish } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { useZnsContracts } from "../lib/contracts";
import { values } from "lodash";
import { useDomainCache } from "../lib/useDomainCache";
import { send } from "q";

interface ApprovalProps {
  approver: string;
  approvee: string;
  domain_id: BigNumberish;
}

const Approve: React.FC<ApprovalProps> = ({
  approver: _approver,
  approvee: _approvee,
  domain_id: _domain_id,
}) => {
  const context = useWeb3React<Web3Provider>();
  const { account } = context;
  const contracts = useZnsContracts();

  const _approve = useCallback(() => {
    if (account && contracts.isJust())
      contracts.value.registrar
        .safeApproveFrom(_sender === account)
        .then((txr: { wait: (arg0: number) => any }) => txr.wait(1))
        .then(() => {
          return Approve();
        });
  }, [contracts, account]);

  if (sender.isNothing()) return <p>Loading</p>;

  return <>z</>;
};

export default Approve;
