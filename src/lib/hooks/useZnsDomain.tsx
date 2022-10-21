/* eslint-disable react-hooks/exhaustive-deps */
import { DisplayParentDomain, Maybe, Metadata } from 'lib/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useZnsSdk } from 'lib/hooks/sdk';
import { getMetadata } from 'lib/metadata';
import { Domain, ConvertedTokenInfo } from '@zero-tech/zns-sdk';
import { isRootDomain } from 'lib/utils';
import getPaymentTokenInfo from 'lib/paymentToken';
import config from 'config';

export type UseZnsDomainReturn = {
	loading: boolean;
	domain?: DisplayParentDomain;
	refetch: (variables?: any) => any;
	domainMetadata: Maybe<Metadata>;
	paymentToken: Maybe<string>;
	paymentTokenInfo: ConvertedTokenInfo;
};

type FormatSubdomainType = {
	owner: { id: string };
	metadata: string;
	minter: { id: string };
	name: string;
	id: string;
};

/**
 * Changes an SDK subdomain type to dApp subdomain type
 * This won't be needed when we properly integrate SDK types
 * @param subdomains -
 * @returns
 */
const formatSubdomains = (subdomains: Domain[]): FormatSubdomainType[] => {
	return subdomains.map((sub) => ({
		id: sub.id ?? '',
		metadata: sub.metadataUri ?? '',
		minter: { id: sub.minter ?? '' },
		name: sub.name ?? '',
		owner: { id: sub.owner ?? '' },
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

interface DomainData {
	domain: DisplayParentDomain | undefined;
	metadata: Metadata | undefined;
	paymentTokenInfo: ConvertedTokenInfo;
}

export const useZnsDomain = (
	domainId: string,
	chainId: number,
): UseZnsDomainReturn => {
	const { instance: sdk } = useZnsSdk();

	const isMounted = useRef<boolean>();
	const loadingDomainId = useRef<string | undefined>();

	const [loading, setLoading] = useState(true);
	const [domainData, setDomainData] = useState<DomainData | undefined>();

	const getDomain = async (id: string) => {
		const domain = formatDomain(
			await sdk.getDomainById(id, config.useDataStore),
		);
		const metadata = isRootDomain(domain.id)
			? undefined
			: await getMetadata(domain.metadata);
		return { domain, metadata };
	};

	const getSubdomains = async (id: string) => {
		// Disable DataStore
		return formatSubdomains(
			await sdk.getSubdomainsById(id, config.useDataStore),
		);
	};

	/**
	 * This method gets all of the data relevant to a domain
	 */
	const refetch = useCallback(async () => {
		try {
			loadingDomainId.current = domainId;

			// Reset state objects
			setDomainData(undefined);
			setLoading(true);

			const d = await getDomain(domainId);

			if (loadingDomainId.current !== domainId) {
				setLoading(false);
				return;
			}

			let subdomains;

			try {
				subdomains = await getSubdomains(domainId);
			} catch (e: any) {
				console.error('Subdomains do not exist on domain', e);
			}

			if (loadingDomainId.current !== domainId || isMounted.current === false) {
				setLoading(false);
				return;
			}

			let paymentToken;
			const tokenId = isRootDomain(d.domain.id)
				? undefined
				: await sdk.zauction.getPaymentTokenForDomain(domainId);
			if (tokenId) {
				paymentToken = await getPaymentTokenInfo(sdk, tokenId);
			}

			if (isMounted.current) {
				setDomainData({
					domain: {
						...d.domain,
						...d.metadata,
						subdomains: subdomains ?? [],
					} as DisplayParentDomain,
					metadata: d.metadata,
					paymentTokenInfo: paymentToken
						? { ...paymentToken, id: tokenId! }
						: ({} as ConvertedTokenInfo),
				});
				setLoading(false);
			}
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

	return {
		loading,
		domain: domainData?.domain,
		refetch,
		domainMetadata: domainData?.metadata,
		paymentToken: domainData?.paymentTokenInfo.id,
		paymentTokenInfo:
			domainData?.paymentTokenInfo ?? ({} as ConvertedTokenInfo),
	};
};
