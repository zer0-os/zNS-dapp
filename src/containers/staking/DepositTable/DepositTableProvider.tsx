// React Imports
import React from 'react';

// Web3 Imports
import { useStakingPoolSelector } from 'lib/providers/staking/PoolSelectProvider';

export const BidContext = React.createContext({});

type DepositProviderType = {
	children: React.ReactNode;
};

const DepositProvider: React.FC<DepositProviderType> = ({ children }) => {
	//////////////////////////
	// Hooks & State & Data //
	//////////////////////////

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const selectPool = useStakingPoolSelector().selectStakePool;

	const contextValue = {};

	return (
		<BidContext.Provider value={contextValue}>{children}</BidContext.Provider>
	);
};

export default DepositProvider;
