import { useWeb3React } from '@web3-react/core';
import { useContractAddresses, useZnsContracts } from 'lib/contracts';
import React from 'react';
import * as zfi from '@zero-tech/zfi-sdk';
import { Instance } from '@zero-tech/zfi-sdk/lib/types';
import { MaybeUndefined } from 'lib/types';
import {
	poolContent,
	WrappedStakingPool,
	WrappedStakingPools,
} from './StakingProviderTypes';

export const StakingContext = React.createContext({
	instance: undefined as MaybeUndefined<Instance>,
	pools: undefined as MaybeUndefined<WrappedStakingPools>,
});

type StakingProviderType = {
	children: React.ReactNode;
};

export const StakingSDKProvider: React.FC<StakingProviderType> = ({
	children,
}) => {
	const { account, library, chainId } = useWeb3React();
	const contracts = useZnsContracts();
	const contractAddresses = useContractAddresses();

	const [instance, setInstance] =
		React.useState<MaybeUndefined<Instance>>(undefined);
	const [pools, setPools] =
		React.useState<MaybeUndefined<WrappedStakingPools>>(undefined);

	React.useEffect(() => {
		if (!library || !contractAddresses) {
			return;
		}

		const instance = zfi.createInstance({
			wildPoolAddress: contractAddresses.wildStakingPool,
			lpTokenPoolAddress: contractAddresses.lpStakingPool,
			factoryAddress: contractAddresses.stakeFactory,
			provider: library,
		});

		setInstance(instance);
	}, [contractAddresses, library]);

	React.useEffect(() => {
		if (!instance) {
			return;
		}

		const getMetrics = async () => {
			const wildPool: WrappedStakingPool = {
				instance: instance.wildPool,
				content: poolContent.wildPool,
				metrics: {
					apy: await instance.wildPool.poolApr(),
				},
			};

			const lpPool: WrappedStakingPool = {
				instance: instance.liquidityPool,
				content: poolContent.lpPool,
				metrics: {
					apy: await instance.liquidityPool.poolApr(),
				},
			};

			const pools = {
				wildPool,
				lpPool,
			};

			setPools(pools);
		};
		getMetrics();
	}, [instance]);

	const contextValue = {
		instance,
		pools,
	};

	return (
		<StakingContext.Provider value={contextValue}>
			{children}
		</StakingContext.Provider>
	);
};

export function useStaking() {
	const context = React.useContext(StakingContext);

	return context;
}
