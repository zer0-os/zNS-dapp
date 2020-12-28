import { AbiCoder } from "@ethersproject/abi";
import { keccak256 } from "@ethersproject/keccak256";
import { BigNumber } from "@ethersproject/bignumber";
// import { toUtf8Bytes } from '@ethersproject/strings'
const coder = new AbiCoder();

function getDomainId(_domain: string): string {
  const domains = _domain.split(".");
  let hash =
    "0x0000000000000000000000000000000000000000000000000000000000000000";
  for (const domain of domains) {
    hash = keccak256(coder.encode(["bytes32", "string"], [hash, domain]));
  }
  return BigNumber.from(hash).toString();
}

export { getDomainId };
