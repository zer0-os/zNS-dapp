//- React Imports
import {
	ApolloClient,
	ApolloProvider,
	InMemoryCache,
	NormalizedCacheObject,
} from '@apollo/client';
import React from 'react';
import { useChainSelector } from './ChainSelectorProvider';

interface context {
	client: ApolloClient<NormalizedCacheObject> | undefined;
}

const SubgraphContext = React.createContext<context>({
	client: undefined,
});

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
		return new ApolloClient({
			uri: chainIdToSubgraph(chainSelector.selectedChain),
			cache: new InMemoryCache(),
		});
	}, [chainSelector.selectedChain]);

	const contextValue = {
		client: apolloClient,
	};

	return (
		<SubgraphContext.Provider value={contextValue}>
			<ApolloProvider client={apolloClient}>{children}</ApolloProvider>
		</SubgraphContext.Provider>
	);
};
