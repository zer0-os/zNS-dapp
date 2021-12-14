'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.pendingYieldRewards = void 0;
const ethers_1 = require('ethers');
const helpers_1 = require('../helpers');
const pendingYieldRewards = async (address, config) => {
	if (!ethers_1.ethers.utils.isAddress(address))
		throw Error('Must provide a valid user address');
	const corePool = await (0, helpers_1.getCorePool)(config);
	const pendingYieldRewards = await corePool.pendingYieldRewards(address);
	return pendingYieldRewards;
};
exports.pendingYieldRewards = pendingYieldRewards;
//# sourceMappingURL=pendingYieldRewards.js.map
