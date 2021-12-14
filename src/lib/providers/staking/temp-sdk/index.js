'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.createInstance = void 0;
const actions = require('./actions');
const helpers_1 = require('./helpers');
const createInstance = (config) => {
	// Consumer will do `sdkInstance.wildPool.stake()`
	const factoryConfig = {
		address: config.factoryAddress,
		provider: config.provider,
	};
	const wildConfig = {
		address: config.wildPoolAddress,
		provider: config.provider,
	};
	const liquidityConfig = {
		address: config.lpTokenPoolAddress,
		provider: config.provider,
	};
	const factory = getFactoryInstance(factoryConfig);
	const wildPool = getPoolInstance(wildConfig);
	const liquidityPool = getPoolInstance(liquidityConfig);
	return {
		factory: factory,
		wildPool: wildPool,
		liquidityPool: liquidityPool,
	};
};
exports.createInstance = createInstance;
// The zFI SDK requires that you create an instance once for every staking pool.
// As we have one WILD/ETH LP staking pool, and one WILD staking pool, there must be two instances
const getPoolInstance = (config) => {
	const instance = {
		stake: async (amount, lockUntil, signer) => {
			// ZStakeCorePool of either ETH/WILD liquidity tokens or WILD
			const tx = await actions.stake(amount, lockUntil, signer, config);
			return tx;
		},
		unstake: async (depositId, amount, signer) => {
			const tx = await actions.unstake(depositId, amount, signer, config);
			return tx;
		},
		processRewards: async (signer) => {
			const tx = await actions.processRewards(signer, config);
			return tx;
		},
		updateStakeLock: async (depositId, lockUntil, signer) => {
			const tx = await actions.updateStakeLock(
				depositId,
				lockUntil,
				signer,
				config,
			);
			return tx;
		},
		pendingYieldRewards: async (address) => {
			// If address has no associated stake it will return 0
			const pendingRewards = await actions.pendingYieldRewards(address, config);
			return pendingRewards;
		},
		getAllDeposits: async (address) => {
			const deposits = await actions.getAllDeposits(address, config);
			return deposits;
		},
		getUser: async (address) => {
			const corePool = await (0, helpers_1.getCorePool)(config);
			const user = await corePool.users(address);
			return user;
		},
		getPoolToken: async () => {
			const corePool = await (0, helpers_1.getCorePool)(config);
			const poolToken = await corePool.poolToken();
			return poolToken;
		},
		getLastYieldDistribution: async () => {
			const corePool = await (0, helpers_1.getCorePool)(config);
			const lastYieldDistribution = await corePool.lastYieldDistribution();
			return lastYieldDistribution;
		},
		getLiquidityPoolWeight: async () => {
			const corePool = await (0, helpers_1.getCorePool)(config);
			const weight = await corePool.weight();
			return weight;
		},
		getTokenPoolWeight: async () => {
			const corePool = await (0, helpers_1.getCorePool)(config);
			const weight = await corePool.weight();
			return weight;
		},
		getRewardTokensPerBlock: async () => {
			const factory = await (0, helpers_1.getPoolFactory)(config);
			const tokensPerBlock = await factory.getRewardTokensPerBlock();
			return tokensPerBlock;
		},
		// Calculate user value locked
		calculateUserValueLocked: async (userAddress) => {
			// Will return a user's total deposit value that is both locked and unlocked
			// e.g. [valueLocked, valueUnlocked]
			return await actions.calculateUserValueLocked(userAddress, config);
		},
	};
	return instance;
};
const getFactoryInstance = (config) => {
	const instance = {
		getPoolAddress: async (poolToken) => {
			const factory = await (0, helpers_1.getPoolFactory)(config);
			const poolAddress = await factory.getPoolAddress(poolToken);
			return poolAddress;
		},
		getPoolData: async (poolAddress) => {
			if (poolAddress === '0' || poolAddress === '0x0')
				throw Error('Cannot get pool data for empty pool address');
			const factory = await (0, helpers_1.getPoolFactory)(config);
			const poolData = await factory.getPoolData(poolAddress);
			return poolData;
		},
	};
	return instance;
};
//# sourceMappingURL=index.js.map
