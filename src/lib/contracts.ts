import { Provider, Web3Provider } from "@ethersproject/providers";
import { Signer } from "@ethersproject/abstract-signer";
import { Registrar__factory, Registrar } from "../types";
import { useWeb3React } from "@web3-react/core";
import { useMemo, useState } from "react";
import addresses from './addresses'
// import Maybe, { Just, Nothing } from "true-myth/maybe";
import { chainIdToNetworkType } from "./network";

export interface ContractAddresses {
  registrar: string;
}

export interface Contracts {
  registrar: Registrar;
}

function useZnsContracts(): Contracts {
  const context = useWeb3React<Web3Provider>();
  const {
    library,
    account,
    active,
    chainId
  } = context;
  const contracts = useMemo((): Contracts => {
    if (!active || !library) throw new Error("web3 not initialized");
    return {
      registrar: Registrar__factory.connect(
        addresses[chainIdToNetworkType(chainId!)].registrar,
        library.getSigner()
      ),
    };
  }, [active, library, account]);
  return contracts;
}

export { useZnsContracts };
