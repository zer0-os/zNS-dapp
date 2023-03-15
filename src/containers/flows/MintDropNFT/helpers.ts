//- Library Imports
import { ethers } from 'ethers';
import {
	ClaimWithChildInstance,
	GenSaleData,
	GenSaleInstance,
	GenSaleStatus,
	SaleStatus,
} from '@zero-tech/zsale-sdk/';

//- Types Improts
import { Stage, DropData } from './types';
import { WhitelistSimpleSale, ERC20 } from 'types';

const TEST_MODE = false;
const TEST_STATE: SaleStatus = SaleStatus.PrivateSale;
const IS_ON_WHITELIST = true;

const TEST: { [status in GenSaleStatus]: GenSaleData } = {
	[GenSaleStatus.NotStarted]: {
		amountSold: 0,
		amountForSale: 50,
		salePrice: '0.007',
		started: false,
		paused: false,
		startBlock: 10488021,
		limitPerTransaction: 10,
		saleStatus: GenSaleStatus.NotStarted,
	},
	[GenSaleStatus.ClaimSale]: {
		amountSold: 10,
		amountForSale: 50,
		salePrice: '0.007',
		started: true,
		paused: false,
		startBlock: 10488021,
		limitPerTransaction: 10,
		saleStatus: GenSaleStatus.ClaimSale,
	},
	[GenSaleStatus.PrivateSale]: {
		amountSold: 40,
		amountForSale: 50,
		salePrice: '0.007',
		started: true,
		paused: false,
		startBlock: 10488021,
		limitPerTransaction: 10,
		saleStatus: GenSaleStatus.PrivateSale,
	},
	[GenSaleStatus.Ended]: {
		amountSold: 50,
		amountForSale: 50,
		salePrice: '0.007',
		started: true,
		paused: true,
		startBlock: 10488021,
		limitPerTransaction: 10,
		saleStatus: GenSaleStatus.Ended,
	},
};

export const getDropData = (
	zSaleInstance: GenSaleInstance,
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

export const getDropStage = async (
	zSaleInstance: ClaimWithChildInstance | GenSaleInstance,
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
	if ((status as unknown) === GenSaleStatus.NotStarted) {
		return Stage.Upcoming;
	}
	if (data.amountSold === data.amountForSale) {
		return Stage.Sold;
	}
	// Added for matching with the old sale status
	if ((status as unknown) === GenSaleStatus.ClaimSale) {
		return Stage.Whitelist;
	}

	if ((status as unknown) === GenSaleStatus.Ended) {
		return Stage.Ended;
	}
	if ((status as unknown) === GenSaleStatus.PrivateSale) {
		return Stage.Public;
	}
};

export const getNumberPurchasedByUser = async (
	zSaleInstance: GenSaleInstance,
	account: string,
) => {
	const number = await zSaleInstance.getDomainsPurchasedByAccount(account);
	return number;
};

export const getMaxPurchasesPerUser = async (
	zSaleInstance: GenSaleInstance,
	account: string,
) => {
	const quantity = await zSaleInstance.numberPurchasableByAccount(account);
	return quantity;
};

export const getUserEligibility = async (
	account: string,
	zSaleInstance: GenSaleInstance,
): Promise<boolean | undefined> => {
	if (TEST_MODE) {
		return IS_ON_WHITELIST;
	} else {
		const isWhitelisted = await zSaleInstance.isUserOnMintlist(account);
		return isWhitelisted;
	}
};

const getWheelQuantities = async (
	zSaleInstance: GenSaleInstance,
): Promise<GenSaleData | undefined> => {
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
