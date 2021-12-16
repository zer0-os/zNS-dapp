import { WrappedDeposit } from 'containers/staking/DepositTable/DepositTable';
import { MaybeUndefined } from 'lib/types';
import React from 'react';
import { WrappedStakingPool } from './StakingProviderTypes';

export const SelectorContext = React.createContext({
	unstake: (pool: MaybeUndefined<WrappedDeposit>) => {},
	unstaking: undefined as MaybeUndefined<WrappedDeposit>,
	claim: (pool: MaybeUndefined<WrappedStakingPool>) => {},
	claiming: undefined as MaybeUndefined<WrappedStakingPool>,
	selectStakePool: (pool: MaybeUndefined<WrappedStakingPool>) => {},
	stakePool: undefined as MaybeUndefined<WrappedStakingPool>,
});

type SelectorContextProviderType = {
	children: React.ReactNode;
};

export const PoolSelectProvider: React.FC<SelectorContextProviderType> = ({
	children,
}) => {
	const [unstaking, setUnstaking] =
		React.useState<MaybeUndefined<WrappedDeposit>>();
	const [claiming, setClaiming] =
		React.useState<MaybeUndefined<WrappedStakingPool>>();
	const [stakePool, setStakePool] =
		React.useState<MaybeUndefined<WrappedStakingPool>>();

	const contextValue = {
		unstake: setUnstaking,
		unstaking: unstaking,
		claim: setClaiming,
		claiming: claiming,
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
