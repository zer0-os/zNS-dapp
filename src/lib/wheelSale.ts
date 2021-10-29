import { WheelQuantity } from 'containers/flows/MintWheels/types';
import { BigNumber, ethers } from 'ethers';
import { WhitelistSimpleSale } from 'types';
import { Maybe } from './types';

const whitelistUriKovan =
	'https://ipfs.io/ipfs/QmQUDvsZmBAi1Dw1Eo1iS9WmpvMvEC9vJ71MdEk9WsfSXM';

const backupWhitelist =
	'https://ipfs.io/ipfs/QmUfqAdwAdZ5mar1VHjmn8cXxPJ9hcoXophP2GF7nY5v8S';
const whitelistUriMainnet =
	'https://d3810nvssqir6b.cloudfront.net/wheels-launch-2-merkleTree.json';

export interface WheelsWhitelistClaim {
	index: number;
	proof: string[];
}

export interface WheelsWhitelistDto {
	merkleRoot: string;
	claims: { [account: string]: Maybe<WheelsWhitelistClaim> };
}

let cachedWhitelist: Maybe<WheelsWhitelistDto>;

export const getWhitelist = async (
	mainnet: boolean,
): Promise<WheelsWhitelistDto> => {
	if (cachedWhitelist) {
		return cachedWhitelist;
	}

	let whitelistUri = mainnet ? whitelistUriMainnet : whitelistUriKovan;

	let res;
	let body;
	try {
		res = await fetch(whitelistUri);
		body = await res.json();
	} catch (e) {
		res = await fetch(backupWhitelist);
		body = await res.json();
	}

	cachedWhitelist = body as WheelsWhitelistDto;

	return cachedWhitelist;
};

export const getUserClaim = async (
	user: string,
	mainnet: boolean,
): Promise<Maybe<WheelsWhitelistClaim>> => {
	const whitelist = await getWhitelist(mainnet);
	const userClaim = whitelist.claims[user];
	return userClaim;
};

export const isUserOnWhitelist = async (
	user: string,
	mainnet: boolean,
): Promise<boolean> => {
	const userClaim = await getUserClaim(user, mainnet);

	if (!userClaim) {
		return false;
	}

	return true;
};

export enum SaleStatus {
	NotStarted,
	WhitelistOnly,
	Public,
}

export const getSaleStatus = async (
	contract: WhitelistSimpleSale,
): Promise<SaleStatus> => {
	const saleStarted = await contract.saleStarted();

	if (!saleStarted) {
		return SaleStatus.NotStarted;
	}

	const currentBlock = await contract.provider.getBlockNumber();
	const saleStartBlock = await contract.saleStartBlock();
	const saleDuration = await contract.whitelistSaleDuration();

	if (BigNumber.from(currentBlock).gt(saleStartBlock.add(saleDuration))) {
		return SaleStatus.Public;
	} else {
		return SaleStatus.WhitelistOnly;
	}
};

export const getWheelsSaleData = async (
	contract: WhitelistSimpleSale,
): Promise<WheelQuantity> => {
	const totalForSale = await contract.totalForSale();
	const totalSold = await contract.domainsSold();

	return {
		minted: totalSold.toNumber(),
		total: totalForSale.toNumber(),
	};
};

export const purchaseWheels = async (
	quantity: number,
	contract: WhitelistSimpleSale,
	mainnet: boolean,
): Promise<ethers.ContractTransaction> => {
	const status = await getSaleStatus(contract);

	let tx: Maybe<ethers.ContractTransaction>;

	const value = (await contract.salePrice()).mul(quantity);

	if (status === SaleStatus.WhitelistOnly) {
		const userAddress = await contract.signer.getAddress();
		const claim = await getUserClaim(userAddress, mainnet);

		if (!claim) {
			throw Error(`User not whitelisted`);
		}

		tx = await contract.purchaseDomainsWhitelisted(
			quantity,
			claim.index,
			claim.proof,
			{
				value,
			},
		);
	} else {
		tx = await contract.purchaseDomains(quantity, { value });
	}

	return tx;
};

export const getNumberPurchasedByUser = async (
	user: string,
	contract: WhitelistSimpleSale,
): Promise<number> => {
	const purchased = await contract.domainsPurchasedByAccount(user);
	return purchased.toNumber();
};

export const getMaxPurchasesPerUser = async (
	contract: WhitelistSimpleSale,
): Promise<number> => {
	const max = await contract.currentMaxPurchaseCount();
	return max.toNumber();
};
