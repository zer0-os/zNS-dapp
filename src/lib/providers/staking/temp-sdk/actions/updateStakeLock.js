'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.updateStakeLock = void 0;
const ethers = require('ethers');
const helpers_1 = require('../helpers');
const updateStakeLock = async (depositId, lockUntil, signer, config) => {
	if (lockUntil.lte(ethers.BigNumber.from('0')))
		throw Error('Cannot add zero or negative time to your locking period');
	const corePool = await (0, helpers_1.getCorePool)(config);
	const tx = await corePool
		.connect(signer)
		.updateStakeLock(depositId, lockUntil);
	return tx;
};
exports.updateStakeLock = updateStakeLock;
//# sourceMappingURL=updateStakeLock.js.map
