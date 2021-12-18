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
import { Web3Provider } from '@ethersproject/providers';

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
	const { account, library, chainId } = useWeb3React<Web3Provider>();
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
	}, [contractAddresses, library, chainId]);

	React.useEffect(() => {
		let isMounted = true;

		console.log(instance);

		const getMetrics = async () => {
			if (!instance) {
				return;
			}

			const wildPool: WrappedStakingPool = {
				instance: instance.wildPool,
				content: poolContent.wildPool,
				metrics: {
					apy: await instance.wildPool.poolApr(),
					tvl: await instance.wildPool.poolTvl(),
				},
			};

			const lpPool: WrappedStakingPool = {
				instance: instance.liquidityPool,
				content: poolContent.lpPool,
				metrics: {
					apy: await instance.liquidityPool.poolApr(),
					tvl: await instance.liquidityPool.poolTvl(),
				},
			};

			const pools = {
				wildPool,
				lpPool,
			};

			if (isMounted) {
				setPools(pools);
			}
		};
		getMetrics().catch((e) => {
			console.log(e.stack);
		});

		return () => {
			isMounted = false;
		};
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
