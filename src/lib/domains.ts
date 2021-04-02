import { AbiCoder } from '@ethersproject/abi';
import { keccak256 } from '@ethersproject/keccak256';
import { BigNumber } from '@ethersproject/bignumber';
const coder = new AbiCoder();

const zeroBytes32 = '0x0';

const ROOT_ID = keccak256(
  coder.encode(['uint256', 'string'], [zeroBytes32, 'ROOT']),
);
function getDomainId(_domain: string): string {
  if (_domain === 'ROOT') {
    return BigNumber.from(ROOT_ID).toString();
  }
  const domains = _domain.split('.');
  let parent = ROOT_ID;
  for (const domain of domains) {
    parent = keccak256(coder.encode(['uint256', 'string'], [parent, domain]));
  }
  return BigNumber.from(parent).toString();
}

export { getDomainId };
