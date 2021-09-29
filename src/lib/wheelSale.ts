import { WheelQuantity } from 'containers/flows/MintWheels/types';
import { BigNumber, ethers } from 'ethers';
import { WhitelistSimpleSale } from 'types';
import { Maybe } from './types';

const whitelistUri =
	'https://ipfs.io/ipfs/QmQUDvsZmBAi1Dw1Eo1iS9WmpvMvEC9vJ71MdEk9WsfSXM';

export interface WheelsWhitelistClaim {
	index: number;
	proof: string[];
}

export interface WheelsWhitelistDto {
	merkleRoot: string;
	claims: { [account: string]: Maybe<WheelsWhitelistClaim> };
}

let cachedWhitelist: Maybe<WheelsWhitelistDto>;

export const getWhitelist = async (): Promise<WheelsWhitelistDto> => {
	if (cachedWhitelist) {
		return cachedWhitelist;
	}

	const res = await fetch(whitelistUri);
	const body = await res.json();

	cachedWhitelist = body as WheelsWhitelistDto;

	return cachedWhitelist;
};

export const getUserClaim = async (
	user: string,
): Promise<Maybe<WheelsWhitelistClaim>> => {
	const whitelist = await getWhitelist();
	const userClaim = whitelist.claims[user];
	return userClaim;
};

export const isUserOnWhitelist = async (user: string): Promise<boolean> => {
	const userClaim = getUserClaim(user);

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
): Promise<ethers.ContractTransaction> => {
	const status = await getSaleStatus(contract);

	let tx: Maybe<ethers.ContractTransaction>;

	const value = (await contract.salePrice()).mul(quantity);

	if (status === SaleStatus.WhitelistOnly) {
		const userAddress = await contract.signer.getAddress();
		const claim = await getUserClaim(userAddress);

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
	const max = await contract.maxPurchasesPerAccount();
	return max.toNumber();
};
