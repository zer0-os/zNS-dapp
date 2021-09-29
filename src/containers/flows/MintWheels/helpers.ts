import { Stage, WheelQuantity, DropData } from './types';

import * as wheels from '../../../lib/wheelSale';
import { WhitelistSimpleSale } from 'types';
import { ethers } from 'ethers';

export const EthPerWheel = 0.07;

const testApiFailure = false;

const testConfig = {
	stage: Stage.Whitelist,
	whitelist: true,
	wheelsTotal: 1000,
	wheelsMinted: 500,
	balance: 0.1,
	apiResponseTime: 2500,
};

export const getDropData = (
	contract: WhitelistSimpleSale,
): Promise<DropData | undefined> => {
	return new Promise(async (resolve, reject) => {
		try {
			const [dropStage, wheelQuantities, maxPurchasesPerUser] =
				await Promise.all([
					getDropStage(contract),
					getWheelQuantities(contract),
					getMaxPurchasesPerUser(contract),
				]);

			// Check if we somehow got an undefined variable
			if (
				dropStage === undefined ||
				wheelQuantities === undefined ||
				wheelQuantities.total === undefined ||
				wheelQuantities.minted === undefined ||
				maxPurchasesPerUser === undefined
			) {
				throw Error('Failed to retrieve primary data');
			}

			resolve({
				dropStage,
				wheelsTotal: wheelQuantities.total,
				wheelsMinted: wheelQuantities.minted,
				maxPurchasesPerUser,
			} as DropData);
		} catch (error) {
			reject(error);
		}
	});
};

const getDropStage = async (
	contract: WhitelistSimpleSale,
): Promise<Stage | undefined> => {
	const status = await wheels.getSaleStatus(contract);

	if (status === wheels.SaleStatus.NotStarted) {
		return Stage.Upcoming;
	}

	const data = await wheels.getWheelsSaleData(contract);

	if (data.minted === data.total) {
		return Stage.Sold;
	}

	if (status === wheels.SaleStatus.WhitelistOnly) {
		return Stage.Whitelist;
	}

	if (status === wheels.SaleStatus.Public) {
		return Stage.Public;
	}
};

export const getNumberPurchasedByUser = async (
	userId: string,
	contract: WhitelistSimpleSale,
) => {
	const number = await wheels.getNumberPurchasedByUser(userId, contract);
	return number;
};

export const getMaxPurchasesPerUser = async (contract: WhitelistSimpleSale) => {
	const max = await wheels.getMaxPurchasesPerUser(contract);
	return max;
};

export const getUserEligibility = async (
	userId: string,
	contract: WhitelistSimpleSale,
): Promise<boolean | undefined> => {
	const isWhitelisted = await wheels.isUserOnWhitelist(userId);
	return isWhitelisted;
};

const getWheelQuantities = async (
	contract: WhitelistSimpleSale,
): Promise<WheelQuantity | undefined> => {
	const data = await wheels.getWheelsSaleData(contract);

	return data;
};

export const getBalanceEth = async (
	signer: ethers.Signer,
): Promise<number | undefined> => {
	const ethBalance = await signer.getBalance();
	const asString = ethers.utils.formatEther(ethBalance);
	return Number(asString);
};
