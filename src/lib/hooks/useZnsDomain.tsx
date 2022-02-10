/* eslint-disable react-hooks/exhaustive-deps */
import { Maybe, Domain, Metadata } from 'lib/types';
import React from 'react';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';

export const useZnsDomain = (domainId: string) => {
	const { instance: sdk } = useZnsSdk();
	const loadingDomainId = React.useRef<string | undefined>(undefined);

	const [domain, setDomain] = React.useState<Maybe<Domain>>(undefined);
	const [subdomains, setSubdomains] =
		React.useState<Maybe<Domain[]>>(undefined);
	const [loading, setLoading] = React.useState<boolean>(true);
	const [metadata, setMetadata] = React.useState<Maybe<Metadata>>(undefined);
	const [refetchSwitch, setRefetchSwitch] = React.useState<boolean>(false);

	React.useEffect(() => {
		let isMounted = true;
		(async () => {
			setLoading(true);
			setSubdomains(undefined);
			setDomain(undefined);
			setMetadata(undefined);
			loadingDomainId.current = domainId;

			const [rawDomain, rawSubdomains] = await Promise.all([
				sdk.getDomainById(domainId),
				sdk.getSubdomainsById(domainId),
			]);

			if (!isMounted || !(loadingDomainId.current === rawDomain?.id)) {
				console.log('cancel load');
				return;
			}

			sdk.utility.getMetadataFromUri(rawDomain.metadataUri).then((m) => {
				setMetadata(m);
			});

			setSubdomains(rawSubdomains);
			setDomain(rawDomain);
			setLoading(false);
		})();
		return () => {
			isMounted = false;
		};
	}, [domainId, refetchSwitch, sdk]);

	const refetch = () => {
		setRefetchSwitch(!refetch);
	};

	return {
		loading,
		domain,
		subdomains,
		metadata,
		refetch,
	};
};
