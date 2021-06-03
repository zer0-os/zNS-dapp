//- React Imports
import { defaultNetworkId } from 'lib/network';
import React, { useState } from 'react';

type context = {
	selectedChain: number;
	selectChain: (id: number) => void;
};

const ChainSelectorContext = React.createContext<context>({
	selectedChain: defaultNetworkId,
	selectChain: (id: number) => {},
});

type ChainSelectorProviderType = {
	children: React.ReactNode;
};

export const ChainSelectorProvider: React.FC<ChainSelectorProviderType> = ({
	children,
}) => {
	const [selectedChain, setSelectedChain] = useState(defaultNetworkId);

	const selectChain = (id: number) => {
		setSelectedChain(id);
	};

	const contextValue = {
		selectedChain,
		selectChain,
	};

	return (
		<ChainSelectorContext.Provider value={contextValue}>
			{children}
		</ChainSelectorContext.Provider>
	);
};

export function useChainSelector() {
	const { selectedChain, selectChain } = React.useContext(ChainSelectorContext);
	return { selectedChain, selectChain };
}
