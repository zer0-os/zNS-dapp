import { AbiCoder } from '@ethersproject/abi';
import { keccak256 } from '@ethersproject/keccak256';
import { BigNumber } from '@ethersproject/bignumber';
import { ethers } from 'ethers';

const coder = new AbiCoder();

const zeroBytes32 = '0x0';

const getDomainId = (name: string): string => {
  const Domain_ID = ethers.utils.id(name);
  return Domain_ID;
};

export { getDomainId };
