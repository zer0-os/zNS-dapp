// React Imports
import React, { useState } from 'react';

// Web3 Imports
import { Domain, Maybe } from 'lib/types';
import { useStakingPoolSelector } from 'lib/providers/staking/PoolSelectProvider';

export const BidContext = React.createContext({});

type DepositProviderType = {
	children: React.ReactNode;
};

const DepositProvider: React.FC<DepositProviderType> = ({ children }) => {
	//////////////////////////
	// Hooks & State & Data //
	//////////////////////////

	const selectPool = useStakingPoolSelector().selectStakePool;

	const contextValue = {};

	return (
		<BidContext.Provider value={contextValue}>{children}</BidContext.Provider>
	);
};

export default DepositProvider;

export function useBid() {
	const {} = React.useContext(BidContext);
	return {};
}
