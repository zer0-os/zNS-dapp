'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.calculateUserValueLocked = void 0;
const ethers_1 = require('ethers');
const _1 = require('.');
const calculateUserValueLocked = async (userAddress, config) => {
	if (!ethers_1.ethers.utils.isAddress(userAddress))
		throw Error('Must provide a valid user address');
	const allUserDeposits = await (0, _1.getAllDeposits)(userAddress, config);
	// Date.now() returns in milliseconds, convert to seconds for comparison
	const timeNow = ethers_1.ethers.BigNumber.from(Math.round(Date.now() / 1000));
	let userValueLocked = ethers_1.ethers.BigNumber.from('0');
	let userValueUnlocked = ethers_1.ethers.BigNumber.from('0');
	for (const deposit of allUserDeposits) {
		if (timeNow.lt(deposit.lockedUntil)) {
			userValueLocked = userValueLocked.add(deposit.tokenAmount);
		} else {
			userValueUnlocked = userValueUnlocked.add(deposit.tokenAmount);
		}
	}
	return {
		userValueLocked: userValueLocked,
		userValueUnlocked: userValueUnlocked,
	};
};
exports.calculateUserValueLocked = calculateUserValueLocked;
//# sourceMappingURL=calculateUserValueLocked.js.map
