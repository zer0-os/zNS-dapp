'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.unstake = void 0;
const ethers_1 = require('ethers');
const helpers_1 = require('../helpers');
const unstake = async (depositId, amount, signer, config) => {
	const corePool = await (0, helpers_1.getCorePool)(config);
	const address = await signer.getAddress();
	if (
		ethers_1.ethers.BigNumber.from(amount).lte(
			ethers_1.ethers.BigNumber.from(0),
		)
	)
		throw Error('You can only unstake a non-zero amount of tokens');
	const depositsLength = await corePool.getDepositsLength(address);
	if (depositsLength.eq(ethers_1.ethers.BigNumber.from(0)))
		throw Error('There are no deposits for you to unstake');
	const deposit = await corePool.getDeposit(address, depositId);
	if (ethers_1.ethers.BigNumber.from(amount).gt(deposit.tokenAmount))
		throw Error('You cannot unstake more than the original stake amount');
	// Date.now() is ms, convert to s
	const dateConverted = Math.round(Date.now() / 1000);
	if (ethers_1.ethers.BigNumber.from(dateConverted).lt(deposit.lockedUntil))
		throw Error(
			'You are not able to unstake when your deposit is still locked',
		);
	const tx = await corePool
		.connect(signer)
		.unstake(
			ethers_1.ethers.BigNumber.from(depositId),
			ethers_1.ethers.BigNumber.from(amount),
		);
	return tx;
};
exports.unstake = unstake;
//# sourceMappingURL=unstake.js.map
