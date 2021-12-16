import { MaybeUndefined } from 'lib/types';
import React from 'react';
import { WrappedStakingPool } from './StakingProviderTypes';

export const SelectorContext = React.createContext({
	selectDepositPool: (pool: MaybeUndefined<WrappedStakingPool>) => {},
	depositPool: undefined as MaybeUndefined<WrappedStakingPool>,
	selectStakePool: (pool: MaybeUndefined<WrappedStakingPool>) => {},
	stakePool: undefined as MaybeUndefined<WrappedStakingPool>,
});

type SelectorContextProviderType = {
	children: React.ReactNode;
};

export const PoolSelectProvider: React.FC<SelectorContextProviderType> = ({
	children,
}) => {
	const [depositPool, setDepositPool] =
		React.useState<MaybeUndefined<WrappedStakingPool>>();
	const [stakePool, setStakePool] =
		React.useState<MaybeUndefined<WrappedStakingPool>>();

	const contextValue = {
		depositPool,
		selectDepositPool: setDepositPool,
		stakePool,
		selectStakePool: setStakePool,
	};

	return (
		<SelectorContext.Provider value={contextValue}>
			{children}
		</SelectorContext.Provider>
	);
};

export function useStakingPoolSelector() {
	const context = React.useContext(SelectorContext);

	return context;
}
