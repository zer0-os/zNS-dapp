import { ethers } from 'ethers';

export const rootDomainName = 'wilder';
export const rootDomainId =
	'0x196c0a1e30004b9998c97b363e44f1f4e97497e59d52ad151208e9393d70bb3b';

export const hash = (x: string): string => {
	const hash = ethers.utils.id(x);
	return hash;
};

const getSubnodeHash = (parentHash: string, labelHash: string): string => {
	const calculatedHash = ethers.utils.keccak256(
		ethers.utils.defaultAbiCoder.encode(
			['bytes32', 'bytes32'],
			[ethers.utils.arrayify(parentHash), ethers.utils.arrayify(labelHash)],
		),
	);

	return calculatedHash;
};

export const getDomainId = (name: string): string => {
	let hashReturn = rootDomainId;

	if (name === '' || undefined || null) {
		return hashReturn;
	}

	const domains = name.split('.');
	for (let i = 0; i < domains.length; i++) {
		hashReturn = getSubnodeHash(hashReturn, ethers.utils.id(domains[i]));
	}
	return hashReturn;
};

export const getRelativeDomainPath = (domain: string): string => {
	const fixedPath = domain.replace(`${rootDomainName}.`, '');

	return fixedPath;
};
