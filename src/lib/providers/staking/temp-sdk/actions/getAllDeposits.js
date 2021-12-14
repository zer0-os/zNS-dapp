'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getAllDeposits = void 0;
const ethers_1 = require('ethers');
const helpers_1 = require('../helpers');
const getAllDeposits = async (address, config) => {
	if (!ethers_1.ethers.utils.isAddress(address))
		throw Error('Must provide a valid user address');
	const corePool = await (0, helpers_1.getCorePool)(config);
	const depositLength = await corePool.getDepositsLength(address);
	if (depositLength.eq(ethers_1.ethers.BigNumber.from('0'))) return [];
	const deposits = [];
	for (let i = 0; i < depositLength.toNumber(); i++) {
		const deposit = await corePool.getDeposit(
			address,
			ethers_1.ethers.BigNumber.from(i),
		);
		// Deposits are left in array even after being unstaked
		// Must check for empty deposits and only add valid,
		// non-zero deposits
		if (!deposit.tokenAmount.eq(ethers_1.ethers.BigNumber.from('0')))
			deposits.push({ depositId: i, ...deposit });
	}
	return deposits;
};
exports.getAllDeposits = getAllDeposits;
//# sourceMappingURL=getAllDeposits.js.map
