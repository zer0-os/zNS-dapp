import { Stage, WheelQuantity } from './types';

export const getDropStage = async (): Promise<Stage | undefined> => {
	// Stub function - should check stage of drop i.e. public, whitelist, etc.
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(Stage.Whitelist);
		}, 259);
	});
};

export const getUserEligibility = async (): Promise<boolean | undefined> => {
	// Stub function - should check eligibility of user
	return new Promise((resolve, reject) => {
		setTimeout(() => {
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
			resolve({
				total: 1000,
				minted: 500,
			});
		}, 23);
	});
};

export const getWildBalance = async (): Promise<number | undefined> => {
	// Stub function - should check total & remanining wheels
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(10000);
		}, 132);
	});
};
