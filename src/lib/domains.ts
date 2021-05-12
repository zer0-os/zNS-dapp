import { AbiCoder } from '@ethersproject/abi';
import { keccak256 } from '@ethersproject/keccak256';
import { BigNumber } from '@ethersproject/bignumber';
import { ethers } from 'ethers';

const coder = new AbiCoder();

const zeroBytes32 = '0x0';

function hash(x: any) {
  return keccak256(x);
}

const getDomainId = (name: string): string => {
  if (name === '' || undefined || null) {
    return ethers.constants.HashZero;
  }

  const domains = name.split('.');

  const getSubnodeHash = (parentHash: string, labelHash: string): string => {
    const calculatedHash = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ['bytes32', 'bytes32'],
        [ethers.utils.arrayify(parentHash), ethers.utils.arrayify(labelHash)],
      ),
    );

    return calculatedHash;
  };
  let hashReturn = ethers.constants.HashZero;
  for (let i = 0; i < domains.length; i++) {
    if (i === 0) {
      hashReturn = getSubnodeHash(hashReturn, ethers.utils.id(domains[0]));
    } else {
      hashReturn = getSubnodeHash(hashReturn, ethers.utils.id(domains[i]));
    }
  }
  return hashReturn;
  //

  // const parentDomain = domains[0];
  // const subDomains = domains[1];
  // return keccak256(
  //   keccak256(ethers.utils.toUtf8Bytes(parentDomain) + getDomainId(subDomains)),
  // );
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

//
