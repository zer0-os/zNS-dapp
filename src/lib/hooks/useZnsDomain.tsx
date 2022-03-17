/* eslint-disable react-hooks/exhaustive-deps */
import { DisplayParentDomain, Maybe, Metadata } from 'lib/types';
import { useEffect, useRef, useState } from 'react';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';

export type UseZnsDomainReturn = {
	loading: boolean;
	domain?: DisplayParentDomain;
	refetch: (variables?: any) => any;
	domainMetadata: Maybe<Metadata>;
};

export const useZnsDomain = (domainId: string): UseZnsDomainReturn => {
	const { instance: sdk } = useZnsSdk();

	const isMounted = useRef<boolean>();

	const loadingDomainId = useRef<string | undefined>(undefined);

	const [loading, setLoading] = useState(true);
	const [domain, setDomain] = useState<DisplayParentDomain | undefined>(
		undefined,
	);
	const [domainMetadata, setDomainMetadata] =
		useState<Maybe<Metadata>>(undefined);

	// Get domain using SDK instead
	const getDomainData = async () => {
		loadingDomainId.current = domainId;

		const [rawDomain, rawSubdomains] = await Promise.all([
			sdk.getDomainById(domainId),
			sdk.getSubdomainsById(domainId),
		]);

		// Check if domain ID has changed since the above API calls
		// to prevent unwanted state changes
		if (
			loadingDomainId.current !== rawDomain.id ||
			isMounted.current === false
		) {
			setLoading(false);
			return;
		}

		// TODO: Fetch this data from the SDK
		const metadata = await sdk.utility.getMetadataFromUri(
			rawDomain.metadataUri,
		);

		// We have currently only changed this hook to use the SDK internally
		// The types in the SDK have changed from what we had previously
		// so the data needs to be formatted. This should be changed
		// to handle the new data type
		// This will be changed in next iteration
		const formattedDomain = rawDomain as any;
		formattedDomain.metadata = formattedDomain.metadataUri;
		formattedDomain.minter = { id: formattedDomain.minter };
		formattedDomain.owner = { id: formattedDomain.owner };
		formattedDomain.parent = { id: formattedDomain.parentId };
		delete formattedDomain.parentId;
		const formattedSubdomains = rawSubdomains.map((sub) => ({
			id: sub.id,
			metadata: sub.metadataUri,
			minter: { id: sub.minter },
			name: sub.name,
			owner: { id: sub.owner },
		}));

		if (isMounted.current) {
			setDomain({
				...formattedDomain,
				subdomains: formattedSubdomains,
				...metadata,
			});
			setDomainMetadata({ ...metadata, ...{ title: metadata.name } });
			setLoading(false);
		}
	};

	const refetch = () => {
		setDomain(undefined);
		setLoading(true);
		getDomainData().catch((e) => {
			// Need better error handling here
			console.error(e);
			setLoading(false);
			loadingDomainId.current = undefined;
		});
	};

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
