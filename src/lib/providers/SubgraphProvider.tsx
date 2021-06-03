//- React Imports
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import React from 'react';
import { useChainSelector } from './ChainSelectorProvider';

type context = {};

const SubgraphContext = React.createContext<context>({});

type SubgraphContextProviderType = {
	children: React.ReactNode;
};

const chainIdToSubgraph = (id: number): string => {
	switch (id) {
		case 1:
			return process.env.REACT_APP_SUBGRAPH_URL_1!;
		case 42:
			return process.env.REACT_APP_SUBGRAPH_URL_42!;
	}

	console.error(`invalid chain id`);
	return '';
};

export const SubgraphProvider: React.FC<SubgraphContextProviderType> = ({
	children,
}) => {
	const chainSelector = useChainSelector();

	const apolloClient = React.useMemo(() => {
		console.log(`chain id is ${chainSelector.selectedChain}`);
		return new ApolloClient({
			uri: chainIdToSubgraph(chainSelector.selectedChain),
			cache: new InMemoryCache(),
		});
	}, [chainSelector.selectedChain]);

	const contextValue = {};

	return (
		<SubgraphContext.Provider value={contextValue}>
			<ApolloProvider client={apolloClient}>{children}</ApolloProvider>
		</SubgraphContext.Provider>
	);
};
