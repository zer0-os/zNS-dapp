/* eslint-disable react-hooks/exhaustive-deps */
import { useDomainMetadata } from 'lib/hooks/useDomainMetadata';
import { DisplayParentDomain, Maybe } from 'lib/types';
import React from 'react';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';

export const useZnsDomain = (domainId: string) => {
	const { instance: sdk } = useZnsSdk();
	const loadingDomainId = React.useRef<string | undefined>(undefined);

	const [domain, setDomain] =
		React.useState<Maybe<DisplayParentDomain>>(undefined);
	const [loading, setLoading] = React.useState<boolean>(true);
	const metadata = useDomainMetadata(domain?.metadata);
	const [refetchSwitch, setRefetchSwitch] = React.useState<boolean>(false);

	React.useEffect(() => {
		(async () => {
			setLoading(true);
			loadingDomainId.current = domainId;

			const [rawDomain, rawSubdomains] = await Promise.all([
				sdk.getDomainById(domainId),
				sdk.getSubdomainsById(domainId),
			]);

			if (!(loadingDomainId.current === rawDomain?.id)) {
				console.log('cancel load');
				return;
			}

			// Format data to match existing
			const formattedDomain = rawDomain as any;
			formattedDomain.metadata = formattedDomain.metadataUri;

			formattedDomain.minter = { id: formattedDomain.minter };
			formattedDomain.owner = { id: formattedDomain.owner };

			const formattedSubdomains = rawSubdomains.map((sub) => ({
				id: sub.id,
				metadata: sub.metadataUri,
				minter: { id: sub.minter },
				name: sub.name,
				owner: { id: sub.owner },
			}));

			setLoading(false);
			setDomain({
				...formattedDomain,
				subdomains: formattedSubdomains,
			});
		})();
	}, [domainId, refetchSwitch, sdk]);

	const refetch = () => {
		setRefetchSwitch(!refetch);
	};

	return {
		loading,
		domain,
		metadata,
		refetch,
	};
};
