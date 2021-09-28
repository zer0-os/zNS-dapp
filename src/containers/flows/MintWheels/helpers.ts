import { Stage, WheelQuantity, PrimaryData } from './types';

export const EthPerWheel = 0.07;

const testApiFailure = false;

const testConfig = {
	stage: Stage.Public,
	whitelist: true,
	wheelsTotal: 1000,
	wheelsMinted: 500,
	balance: 1000,
	apiResponseTime: 300,
};

export const getPrimaryData = (): Promise<PrimaryData | undefined> => {
	return new Promise(async (resolve, reject) => {
		try {
			const [dropStage, wheelQuantities] = await Promise.all([
				getDropStage(),
				getWheelQuantities(),
			]);

			// Check if we somehow got an undefined variable
			if (
				dropStage === undefined ||
				wheelQuantities === undefined ||
				wheelQuantities.total === undefined ||
				wheelQuantities.minted === undefined
			) {
				throw Error('Failed to retrieve primary data');
			}

			resolve({
				dropStage,
				wheelsTotal: wheelQuantities.total,
				wheelsMinted: wheelQuantities.minted,
			} as PrimaryData);
		} catch (error) {
			reject(error);
		}
	});
};

const getDropStage = async (): Promise<Stage | undefined> => {
	// Stub function - should check stage of drop i.e. public, whitelist, etc.
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			// If API call fails, reject
			if (testApiFailure) {
				reject();
			}

			resolve(testConfig.stage);
		}, testConfig.apiResponseTime);
	});
};

export const getUserEligibility = async (
	userId: string,
): Promise<boolean | undefined> => {
	// Stub function - should check eligibility of user
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			// If API call fails, reject
			if (testApiFailure) {
				reject();
			}

			resolve(testConfig.whitelist);
		}, testConfig.apiResponseTime);
	});
};

const getWheelQuantities = async (): Promise<WheelQuantity | undefined> => {
	// Stub function - should check total & remanining wheels
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			// If API call fails, reject
			if (testApiFailure) {
				reject();
			}

			resolve({
				total: testConfig.wheelsTotal,
				minted: testConfig.wheelsMinted,
			});
		}, testConfig.apiResponseTime);
	});
};

export const getBalanceEth = async (): Promise<number | undefined> => {
	// Stub function - should check total & remanining wheels
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (testApiFailure) {
				reject();
			}

			resolve(testConfig.balance);
		}, testConfig.apiResponseTime);
	});
};
