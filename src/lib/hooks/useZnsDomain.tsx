/* eslint-disable react-hooks/exhaustive-deps */
import { DisplayParentDomain, Maybe, Metadata } from 'lib/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useZnsSdk } from 'lib/hooks/sdk';
import { getMetadata } from 'lib/metadata';
import { Domain } from '@zero-tech/zns-sdk/lib/types';

export type UseZnsDomainReturn = {
	loading: boolean;
	domain?: DisplayParentDomain;
	refetch: (variables?: any) => any;
	domainMetadata: Maybe<Metadata>;
};

/**
 * Changes an SDK subdomain type to dApp subdomain type
 * This won't be needed when we properly integrate SDK types
 * @param subdomains -
 * @returns
 */
const formatSubdomains = (
	subdomains: Domain[],
): {
	owner: { id: string };
	metadata: string;
	minter: { id: string };
	name: string;
	id: string;
}[] => {
	return subdomains.map((sub) => ({
		id: sub.id,
		metadata: sub.metadataUri,
		minter: { id: sub.minter },
		name: sub.name,
		owner: { id: sub.owner },
	}));
};

/**
 * Changes an SDK domain type to dApp domain type
 * This won't be needed when we properly integrate SDK types
 * @param domain
 * @returns
 */
const formatDomain = (domain: Domain): DisplayParentDomain => {
	const formattedDomain = domain as any;

	formattedDomain.metadata = formattedDomain.metadataUri;
	delete formattedDomain.metadataUri;
	formattedDomain.minter = { id: formattedDomain.minter };
	formattedDomain.owner = { id: formattedDomain.owner };
	formattedDomain.parent = { id: formattedDomain.parentId };
	delete formattedDomain.parentId;
	formattedDomain.lockedBy = { id: formattedDomain.lockedBy };

	return formattedDomain;
};

export const useZnsDomain = (
	domainId: string,
	chainId: number,
): UseZnsDomainReturn => {
	const { instance: sdk } = useZnsSdk();

	const isMounted = useRef<boolean>();
	const loadingDomainId = useRef<string | undefined>();

	const [loading, setLoading] = useState(true);
	const [domain, setDomain] = useState<DisplayParentDomain | undefined>();
	const [domainMetadata, setDomainMetadata] = useState<Maybe<Metadata>>();

	const getDomain = async (id: string) => {
		const domain = formatDomain(await sdk.getDomainById(id));
		const metadata = await getMetadata(domain.metadata);
		return { domain, metadata };
	};

	const getSubdomains = async (id: string) => {
		const subs = formatSubdomains(await sdk.getSubdomainsById(id));
		return subs;
	};

	/**
	 * This method gets all of the data relevant to a domain
	 */
	const refetch = useCallback(async () => {
		try {
			loadingDomainId.current = domainId;

			// Reset state objects
			setDomainMetadata(undefined);
			setDomain(undefined);
			setLoading(true);

			const d = await getDomain(domainId);
			if (loadingDomainId.current !== domainId) {
				setLoading(false);
				return;
			}
			setDomainMetadata(d.metadata);
			const s = await getSubdomains(domainId);
			if (loadingDomainId.current !== domainId) {
				setLoading(false);
				return;
			}
			setDomain({
				...d.domain,
				...d.metadata,
				subdomains: s,
			} as DisplayParentDomain);

			setLoading(false);
		} catch (e) {}
	}, [domainId, chainId]);

	useEffect(() => {
		isMounted.current = true;
		if (!domainId || !sdk) {
			return;
		}

		refetch();

		return () => {
			isMounted.current = false;
		};
	}, [domainId, sdk]);

	return { loading, domain, refetch, domainMetadata };
};
