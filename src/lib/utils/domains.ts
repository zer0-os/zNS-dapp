//- Constants Imports
import { ASPECT_RATIOS, AspectRatio } from 'constants/aspectRatios';

//- Library Imports
import { ethers } from 'ethers';

export const rootDomainName = '';
export const rootDomainId = ethers.constants.HashZero;

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
	const fixedPath = domain;

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
export const truncateWalletAddress = (
	address: string,
	startingCharacters?: number,
) => {
	return `${address.substring(
		0,
		2 + (startingCharacters ?? 0),
	)}...${address.substring(address.length - 4)}`;
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

/**
 * Gets zNA of parent, e.g. wilder.wheels.genesis -> wilder.wheels
 * @param zna to get parent of
 * @returns zNA of parent, or the original zNA if at root
 */
export const getParentZna = (zna: string): string => {
	if (!zna.includes('.')) {
		return zna;
	}
	return zna.slice(0, zna.lastIndexOf('.'));
};

/**
 * Gets a hardcoded aspect ratio for a zNA
 * @param zna to get aspect ratio for
 * @returns
 */
export const getAspectRatioForZna = (zna: string): AspectRatio | undefined => {
	/* This if is not a long term solution */
	if (zna === 'wilder') {
		return AspectRatio.LANDSCAPE;
	}
	for (const key in ASPECT_RATIOS) {
		const znas = ASPECT_RATIOS[key as unknown as AspectRatio];
		for (var i = 0; i < znas.length; i++) {
			const z = znas[i];
			if (zna.startsWith(z)) {
				return key as AspectRatio;
			}
		}
	}
};

// Parse ZNA
export const getNetworkZNA = (rootDomain: string, zna: string) =>
	rootDomain !== '' ? zna.split('.').splice(1).join('.') : zna;

// Truncate domain
export const truncateDomain = (
	domainName: string,
	maxCharacterLength: number,
) => {
	if (domainName.length > maxCharacterLength) {
		const splits = domainName.split('.');
		if (splits.length > 2) {
			return `${splits[0]}...${splits[splits.length - 1]}`;
		}
		return domainName;
	}
	return domainName;
};
