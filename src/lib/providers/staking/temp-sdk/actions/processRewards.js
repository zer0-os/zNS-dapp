'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.processRewards = void 0;
const ethers_1 = require('ethers');
const _1 = require('.');
const helpers_1 = require('../helpers');
const processRewards = async (signer, config) => {
	// Check pending rewards first to avoid unnecessary gas spending
	const address = await signer.getAddress();
	const pendingRewards = await (0, _1.pendingYieldRewards)(address, config);
	if (pendingRewards.eq(ethers_1.ethers.BigNumber.from('0')))
		throw Error('No rewards to process yet');
	const corePool = await (0, helpers_1.getCorePool)(config);
	// Will send rewards to the locked token pool
	const tx = await corePool.connect(signer).processRewards();
	return tx;
};
exports.processRewards = processRewards;
//# sourceMappingURL=processRewards.js.map
