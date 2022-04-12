import { ethers } from 'ethers';
import { Stage, DropData } from './types';
import { WhitelistSimpleSale, ERC20 } from 'types';
import { Instance, SaleData, SaleStatus } from '@zero-tech/zsale-sdk/lib/types';

const TEST_MODE = true;
const TEST_STATE: SaleStatus = SaleStatus.PrivateSale;
const IS_ON_WHITELIST = true;

const TEST: { [status in SaleStatus]: SaleData } = {
	[SaleStatus.NotStarted]: {
		amountSold: 0,
		amountForSale: 50,
		salePrice: '0.007',
		started: false,
		privateSaleDuration: 568,
		paused: false,
		startBlock: 10488021,
		publicSaleStartBlock: 10488589,
		advanced: {
			amountForSalePrivate: 500,
			amountForSalePublic: 50,
		},
	},
	[SaleStatus.PrivateSale]: {
		amountSold: 10,
		amountForSale: 50,
		salePrice: '0.007',
		started: true,
		privateSaleDuration: 568,
		paused: false,
		startBlock: 10488021,
		publicSaleStartBlock: 10488589,
		advanced: {
			amountForSalePrivate: 500,
			amountForSalePublic: 50,
		},
	},
	[SaleStatus.PublicSale]: {
		amountSold: 40,
		amountForSale: 50,
		salePrice: '0.007',
		started: true,
		privateSaleDuration: 568,
		paused: false,
		startBlock: 10488021,
		publicSaleStartBlock: 10488589,
		advanced: {
			amountForSalePrivate: 500,
			amountForSalePublic: 50,
		},
	},
	[SaleStatus.Ended]: {
		amountSold: 50,
		amountForSale: 50,
		salePrice: '0.007',
		started: true,
		privateSaleDuration: 568,
		paused: true,
		startBlock: 10488021,
		publicSaleStartBlock: 10488589,
		advanced: {
			amountForSalePrivate: 500,
			amountForSalePublic: 50,
		},
	},
};

export const getDropData = (
	zSaleInstance: Instance,
): Promise<DropData | undefined> => {
	return new Promise(async (resolve, reject) => {
		try {
			const [dropStage, saleData] = await Promise.all([
				getDropStage(zSaleInstance),
				getWheelQuantities(zSaleInstance),
			]);

			// Check if we somehow got an undefined variable
			if (
				dropStage === undefined ||
				saleData === undefined ||
				saleData.amountForSale === undefined ||
				saleData.amountSold === undefined
			) {
				throw Error('Failed to retrieve primary data');
			}

			resolve({
				dropStage,
				wheelsTotal: saleData.amountForSale,
				wheelsMinted: saleData.amountSold,
			});
		} catch (error) {
			console.log(error);
			reject(error);
		}
	});
};

const getDropStage = async (
	zSaleInstance: Instance,
): Promise<Stage | undefined> => {
	let status, data;

	if (TEST_MODE) {
		await new Promise((r) => setTimeout(r, 2000));
		status = TEST_STATE;
		data = TEST[TEST_STATE];
	} else {
		status = await zSaleInstance.getSaleStatus();
		data = await zSaleInstance.getSaleData();
	}
	if ((status as unknown) === SaleStatus.NotStarted) {
		return Stage.Upcoming;
	}
	if (data.amountSold === data.amountForSale) {
		return Stage.Sold;
	}

	if ((status as unknown) === SaleStatus.PrivateSale) {
		return Stage.Whitelist;
	}

	if ((status as unknown) === SaleStatus.Ended) {
		return Stage.Ended;
	}
	if ((status as unknown) === SaleStatus.PublicSale) {
		return Stage.Public;
	}
};

export const getNumberPurchasedByUser = async (
	zSaleInstance: Instance,
	account: string,
) => {
	const number = await zSaleInstance.getDomainsPurchasedByAccount(account);
	return number;
};

export const getMaxPurchasesPerUser = async (
	zSaleInstance: Instance,
	account: string,
) => {
	const { quantity } = await zSaleInstance.getMintlistedUserClaim(account);
	return quantity;
};

export const getUserEligibility = async (
	account: string,
	zSaleInstance: Instance,
): Promise<boolean | undefined> => {
	if (TEST_MODE) {
		return IS_ON_WHITELIST;
	} else {
		const isWhitelisted = await zSaleInstance.isUserOnMintlist(account);
		return isWhitelisted;
	}
};

const getWheelQuantities = async (
	zSaleInstance: Instance,
): Promise<SaleData | undefined> => {
	if (TEST_MODE) {
		await new Promise((r) => setTimeout(r, 2000));
		return TEST[TEST_STATE];
	} else {
		const data = await zSaleInstance.getSaleData();
		return data;
	}
};

export const getBalanceEth = async (
	signer: ethers.Signer,
): Promise<number | undefined> => {
	const ethBalance = await signer.getBalance();
	const asString = ethers.utils.formatEther(ethBalance);
	return Number(asString);
};

export const getERC20TokenBalance = async (
	token: ERC20,
	user: string,
): Promise<number> => {
	const balance = await token.balanceOf(user);
	const asString = ethers.utils.formatEther(balance);
	return Number(asString);
};

export const getSaleContractApprovalStatus = async (
	userAddress: string,
	saleContract: WhitelistSimpleSale,
	token: ERC20,
): Promise<boolean> => {
	const allowance = await token.allowance(userAddress, saleContract.address);
	return allowance.gt(ethers.utils.parseEther('1000000'));
};

export const approveSaleContract = async (
	saleContract: WhitelistSimpleSale,
	token: ERC20,
): Promise<ethers.ContractTransaction> => {
	const tx = await token.approve(
		saleContract.address,
		ethers.constants.MaxUint256,
	);
	return tx;
};
