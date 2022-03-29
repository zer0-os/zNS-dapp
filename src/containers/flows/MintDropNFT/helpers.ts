import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { Stage, DropData } from './types';
import { WhitelistSimpleSale, ERC20 } from 'types';
import {
	Instance,
	IPFSGatewayUri,
	SaleData,
	SaleStatus,
} from '@zero-tech/zsale-sdk/lib/types';

export const getDropData = (
	zSaleInstance: Instance,
	library: Web3Provider,
	account: string,
): Promise<DropData | undefined> => {
	return new Promise(async (resolve, reject) => {
		try {
			const [dropStage, saleData, maxPurchasesPerUser] = await Promise.all([
				getDropStage(zSaleInstance, library),
				getWheelQuantities(zSaleInstance, library),
				getMaxPurchasesPerUser(zSaleInstance, account),
			]);

			// Check if we somehow got an undefined variable
			if (
				dropStage === undefined ||
				saleData === undefined ||
				saleData.amountForSale === undefined ||
				saleData.amountSold === undefined ||
				maxPurchasesPerUser === undefined
			) {
				throw Error('Failed to retrieve primary data');
			}

			resolve({
				dropStage,
				wheelsTotal: saleData.amountForSale,
				wheelsMinted: saleData.amountSold,
				maxPurchasesPerUser,
			} as DropData);
		} catch (error) {
			reject(error);
		}
	});
};

const getDropStage = async (
	zSaleInstance: Instance,
	library: Web3Provider,
): Promise<Stage | undefined> => {
	const status = await zSaleInstance.getSaleStatus(library.getSigner());

	if (status === SaleStatus.NotStarted) {
		return Stage.Upcoming;
	}

	const data = await zSaleInstance.getSaleData(library.getSigner());

	if (data.amountSold === data.amountForSale) {
		return Stage.Sold;
	}

	if (status === SaleStatus.MintlistOnly) {
		return Stage.Whitelist;
	}

	if (status === SaleStatus.Ended) {
		return Stage.Ended;
	}
	// TODO: Add support for Public SaleStatus
	// if (status === SaleStatus.Public) {
	// 	return Stage.Public;
	// }
};

export const getNumberPurchasedByUser = async (
	zSaleInstance: Instance,
	library: Web3Provider,
) => {
	const number = await zSaleInstance.getDomainsPurchasedByAccount(
		library.getSigner(),
	);
	return number;
};

export const getMaxPurchasesPerUser = async (
	zSaleInstance: Instance,
	account: string,
) => {
	const { quantity } = await zSaleInstance.getMintlistedUserClaim(
		account,
		IPFSGatewayUri.fleek,
	);
	return quantity;
};

export const getUserEligibility = async (
	userId: string,
	zSaleInstance: Instance,
): Promise<boolean | undefined> => {
	const isWhitelisted = await zSaleInstance.isUserOnMintlist(
		userId,
		IPFSGatewayUri.fleek,
	);
	return isWhitelisted;
};

const getWheelQuantities = async (
	zSaleInstance: Instance,
	library: Web3Provider,
): Promise<SaleData | undefined> => {
	const data = await zSaleInstance.getSaleData(library.getSigner());

	return data;
};

export const getBalanceEth = async (
	signer: ethers.Signer,
): Promise<number | undefined> => {
	const ethBalance = await signer.getBalance();
	const asString = ethers.utils.formatEther(ethBalance);
	return Number(asString);
};

// TODO: Migrate these methods to use SDK once they are available
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
