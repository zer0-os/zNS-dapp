'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.stake = void 0;
const ethers_1 = require('ethers');
const helpers_1 = require('../helpers');
const stake = async (amount, lockUntil, signer, config) => {
	if (
		ethers_1.ethers.BigNumber.from(amount).lte(
			ethers_1.ethers.BigNumber.from(0),
		)
	)
		throw Error('Cannot call to stake with no value given');
	const corePool = await (0, helpers_1.getCorePool)(config);
	const stakeAmount = ethers_1.ethers.BigNumber.from(amount);
	const tx = await corePool.connect(signer).stake(stakeAmount, lockUntil);
	return tx;
};
exports.stake = stake;
//# sourceMappingURL=stake.js.map
