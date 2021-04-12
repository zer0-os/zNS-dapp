import { AbiCoder } from '@ethersproject/abi';
import { keccak256 } from '@ethersproject/keccak256';
import { BigNumber } from '@ethersproject/bignumber';

const coder = new AbiCoder();

const zeroBytes32 = '0x0';

const name = keccak256(coder.encode(['uint256', 'string'], [zeroBytes32, '']));

function getDomainId(name: string): string {
  if (name === '') {
    return '0x0';
  }

  const names = name.split('.', 1);
  let parentDomain = names[0];
  let subDomain = names[1];
  return keccak256('0x');
}

export { getDomainId };
