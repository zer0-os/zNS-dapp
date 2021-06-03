import React, { createContext, forwardRef, useContext } from 'react';

import { useDomainStore } from './useDomainStoreLocal';

export const domainCacheContext = createContext<
	ReturnType<typeof useDomainStore>
>(null as any);

export function DomainCacheProvider({ children }: any) {
	const cache = useDomainStore();

	return (
		<domainCacheContext.Provider value={cache}>
			{children}
		</domainCacheContext.Provider>
	);
}

// Hook version
export function useDomainCache() {
	return useContext(domainCacheContext);
}

// HOC version
export const WithDomainCache = (Component: any) =>
	forwardRef((props, ref) => (
		<domainCacheContext.Consumer>
			{(cache) => <Component ref={ref} {...cache} {...props} />}
		</domainCacheContext.Consumer>
	));
