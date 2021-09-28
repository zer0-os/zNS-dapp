import { Stage, WheelQuantity, PrimaryData } from './types';

export const EthPerWheel = 0.07;

const testApiFailure = false;

export const getPrimaryData = (
	userId: string,
): Promise<PrimaryData | undefined> => {
	return new Promise(async (resolve, reject) => {
		try {
			const [dropStage, isUserEligible, wheelQuantities] = await Promise.all([
				getDropStage(),
				getUserEligibility(userId),
				getWheelQuantities(),
			]);

			// Check if we somehow got an undefined variable
			if (
				dropStage === undefined ||
				isUserEligible === undefined ||
				wheelQuantities === undefined ||
				wheelQuantities.total === undefined ||
				wheelQuantities.minted === undefined
			) {
				throw Error('Failed to retrieve primary data');
			}

			resolve({
				dropStage,
				isUserEligible,
				wheelsTotal: wheelQuantities.total,
				wheelsMinted: wheelQuantities.minted,
			} as PrimaryData);
		} catch (error) {
			reject(error);
		}
	});
};

export const getDropStage = async (): Promise<Stage | undefined> => {
	// Stub function - should check stage of drop i.e. public, whitelist, etc.
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			// If API call fails, reject
			if (testApiFailure) {
				reject();
			}

			resolve(Stage.Public);
		}, 259);
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

			resolve(true);
		}, 103);
	});
};

export const getWheelQuantities = async (): Promise<
	WheelQuantity | undefined
> => {
	// Stub function - should check total & remanining wheels
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			// If API call fails, reject
			if (testApiFailure) {
				reject();
			}

			resolve({
				total: 1000,
				minted: 500,
			});
		}, 23);
	});
};

export const getBalanceEth = async (): Promise<number | undefined> => {
	// Stub function - should check total & remanining wheels
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (testApiFailure) {
				reject();
			}

			resolve(10000);
		}, 132);
	});
};
