'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.changePoolWeight = void 0;
const ethers_1 = require('ethers');
const helpers_1 = require('../helpers');
const changePoolWeight = async (poolAddress, weight, signer, config) => {
	if (!ethers_1.ethers.utils.isAddress(poolAddress))
		throw Error('Must provide a valid pool address');
	if (
		weight.lte(ethers_1.ethers.BigNumber.from('0')) ||
		weight.gt(ethers_1.ethers.BigNumber.from(Number.MAX_SAFE_INTEGER - 1))
	)
		throw Error('Must provide a valid pool weight');
	const factory = await (0, helpers_1.getPoolFactory)(config);
	const signerAddress = await signer.getAddress();
	const owner = await factory.owner();
	if (owner !== signerAddress)
		throw Error('Only the pool factory owner can modify the pool weight');
	const tx = await factory
		.connect(signer)
		.changePoolWeight(poolAddress, ethers_1.ethers.BigNumber.from(weight));
	return tx;
};
exports.changePoolWeight = changePoolWeight;
//# sourceMappingURL=changePoolWeight.js.map
