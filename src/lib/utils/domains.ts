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

export const zNAToLink = (domain: string): string => {
	// remove any 0:// prefix
	{
		const prefix = '0://';
		domain = domain.replace(prefix, '');
	}

	// remove root domain
	domain = domain.replace(rootDomainName, '');

	// remove leading '.'
	if (domain[0] === '.') {
		domain = domain.substr(1);
	}

	return '/market/' + domain;
};

// Truncate wallet address
export const truncateWalletAddress = (address: string) => {
	return `${address.substring(0, 2)}...${address.substring(
		address.length - 4,
	)}`;
};

/**
 * Extracts a zNA from a full pathname
 * e.g. /market/test.name/hello => test.name
 * @param pathname from react-router-dom::useLocation
 * @returns zNA from pathname, or empty string
 */
export const zNAFromPathname = (pathname: string): string => {
	return pathname.replace(/^\/[a-zA-Z]*\//, '').split('/')[0] ?? '';
};

/**
 * Extracts app name from pathname
 * e.g. /market/test.name/hello => /market
 * @param pathname from react-router-dom::useLocation
 * @returns app from pathname, or empty string
 */
export const appFromPathname = (pathname: string): string => {
	const matches = pathname.match(/^\/[a-zA-Z]*/);
	return matches ? matches[0] : '';
};

// Truncate domain
export const truncateDomain = (
	domainName: string,
	maxCharacterLength: number,
) => {
	let domainText;
	if (('wilder.' + domainName).length > maxCharacterLength) {
		domainText = `wilder...${
			domainName.split('.')[domainName.split('.').length - 1]
		}`;
		return domainText;
	} else {
		domainText = `${domainName}`;
		return domainText;
	}
};
