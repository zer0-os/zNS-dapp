'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getPoolFactory = exports.getCorePool = void 0;
const contracts_1 = require('../contracts');
const getCorePool = async (config) => {
	const corePool = await (0, contracts_1.getZStakeCorePool)(
		config.address,
		config.provider,
	);
	return corePool;
};
exports.getCorePool = getCorePool;
const getPoolFactory = async (config) => {
	const poolFactory = await (0, contracts_1.getZStakePoolFactory)(
		config.address,
		config.provider,
	);
	return poolFactory;
};
exports.getPoolFactory = getPoolFactory;
//# sourceMappingURL=index.js.map
