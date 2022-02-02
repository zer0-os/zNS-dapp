import React from 'react';
import { useWeb3React } from '@web3-react/core';
import { WrappedDeposit } from 'containers/staking/DepositTable/DepositTable';
import { MaybeUndefined } from 'lib/types';
import { WrappedStakingPool } from './StakingProviderTypes';
import { useStaking } from './StakingSDKProvider';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';

export const SelectorContext = React.createContext({
	deposits: undefined as MaybeUndefined<WrappedDeposit[]>,
	refetch: () => {},
});

type UserDataContextProviderType = {
	children: React.ReactNode;
};

export const StakingUserDataProvider: React.FC<UserDataContextProviderType> = ({
	children,
}) => {
	const staking = useStaking();
	const { account } = useWeb3React();

	const [deposits, setDeposits] =
		React.useState<MaybeUndefined<WrappedDeposit[]>>();

	const refetch = () => {
		fetchDeposits();
	};

	const fetchDeposits = async () => {
		if (!staking.pools) {
			return;
		}

		if (!account) {
			setDeposits([]);
			return;
		}

		setDeposits(undefined);

		let deposits: WrappedDeposit[] = [];
		for (const pool of Object.values(staking.pools) as WrappedStakingPool[]) {
			const wrappedDeposits = (await pool.instance.getAllDeposits(account)).map(
				(e) => {
					return {
						pool,
						...e,
					} as WrappedDeposit;
				},
			);
			deposits = deposits.concat(wrappedDeposits);
		}

		setDeposits(deposits);
	};

	useUpdateEffect(() => {
		fetchDeposits();
	}, [account, staking.pools]);

	const contextValue = {
		deposits,
		refetch,
	};

	return (
		<SelectorContext.Provider value={contextValue}>
			{children}
		</SelectorContext.Provider>
	);
};

export function useStakingUserData() {
	const context = React.useContext(SelectorContext);

	return context;
}
