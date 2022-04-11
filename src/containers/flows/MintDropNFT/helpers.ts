import { ethers } from 'ethers';
import { Stage, DropData } from './types';
import { WhitelistSimpleSale, ERC20 } from 'types';
import { Instance, SaleData, SaleStatus } from '@zero-tech/zsale-sdk/lib/types';

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
			} as DropData);
		} catch (error) {
			console.log(error);
			reject(error);
		}
	});
};

const getDropStage = async (
	zSaleInstance: Instance,
): Promise<Stage | undefined> => {
	const status = await zSaleInstance.getSaleStatus();
	if (status === SaleStatus.NotStarted) {
		return Stage.Upcoming;
	}

	const data = await zSaleInstance.getSaleData();

	if (data.amountSold === data.amountForSale) {
		return Stage.Sold;
	}

	if (status === SaleStatus.PrivateSale) {
		return Stage.Whitelist;
	}

	if (status === SaleStatus.Ended) {
		return Stage.Ended;
	}
	if (status === SaleStatus.PublicSale) {
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
	const isWhitelisted = await zSaleInstance.isUserOnMintlist(account);
	return isWhitelisted;
};

const getWheelQuantities = async (
	zSaleInstance: Instance,
): Promise<SaleData | undefined> => {
	const data = await zSaleInstance.getSaleData();

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
