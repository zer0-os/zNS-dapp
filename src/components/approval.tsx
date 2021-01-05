import React, { Children, FC, useCallback, useState } from "react";
import { ethers, utils, BigNumberish } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { useZnsContracts } from "../lib/contracts";
import { values } from "lodash";
import { useDomainCache } from "../lib/useDomainCache";
import { send } from "q";

interface ApprovalProps {
  approvee: string;
  domain_id: BigNumberish;
  domain: string;
}

const Approve: React.FC<ApprovalProps> = ({
  approvee: _approvee,
  domain_id: _domain_id,
  domain: _domain,
}) => {
  const context = useWeb3React<Web3Provider>();
  const { account } = context;
  const contracts = useZnsContracts();
  const { useDomain } = useDomainCache();
  const { domain, refetchDomain } = useDomain(_domain);

  const _approve = useCallback(() => {
    if (account && contracts.isJust() && account != _approvee) {
      contracts.value.registrar
        .approve(_approvee, _domain_id)
        .then((txr) => txr.wait(1))
        .then(() => {
          refetchDomain();
        });
    }
  }, [contracts, account]);

  if (domain.isNothing()) return <p>Loading</p>;

  return <>z</>;
};

export default Approve;
