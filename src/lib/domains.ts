import { AbiCoder } from '@ethersproject/abi';
import { keccak256 } from '@ethersproject/keccak256';
import { BigNumber } from '@ethersproject/bignumber';
import { ethers } from 'ethers';

const coder = new AbiCoder();

const zeroBytes32 = '0x0';

const getDomainId = (name: string): string => {
  if (name === '') {
    return zeroBytes32;
  }

  const nameHash = keccak256(coder.encode(['bytes32'], [name]));

  const Domain_ID = ethers.utils.id(name);
  const domains = name.split('.', 1);
  const parentDomain = domains[0];
  const subDomains = domains[1];
  return keccak256(
    keccak256(ethers.utils.toUtf8Bytes(parentDomain) + getDomainId(subDomains)),
  );
};

// const getHash = (parentHash: string, labelHash: string): string => {
//   const calculatedHash = ethers.utils.keccak256(
//     coder.encode(
//       ['bytes32', 'bytes32'],
//       [ethers.utils.arrayify(parentHash), ethers.utils.arrayify(labelHash)],
//     ),
//   );

//   return calculatedHash;
// };

export { getDomainId };
