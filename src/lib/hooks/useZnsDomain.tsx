/* eslint-disable react-hooks/exhaustive-deps */
import { useDomainMetadata } from 'lib/hooks/useDomainMetadata';
import { DisplayParentDomain, Maybe } from 'lib/types';
import React from 'react';
import { useDomainByIdQuery } from './zNSDomainHooks';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';

export const useZnsDomain = (domainId: string) => {
	const { instance: sdk } = useZnsSdk();

	const loadingDomainId = React.useRef<string | undefined>(undefined);
	const [loading, setLoading] = React.useState(true);
	const [domain, setDomain] =
		React.useState<Maybe<DisplayParentDomain>>(undefined);

	const domainQuery = useDomainByIdQuery(domainId);
	const rawDomainData = domainQuery.data?.domain;
	const domainMetadata = useDomainMetadata(rawDomainData?.metadata);

	React.useEffect(() => {
		loadingDomainId.current = domainId;
		setLoading(true);
		setDomain(undefined);
	}, [domainId]);

	React.useEffect(() => {
		if (domainQuery.data?.domain === null) {
			console.warn('404: ' + domainId);
			setDomain(null);
			setLoading(false);
		}
	}, [domainQuery.data]);

	React.useEffect(() => {
		if (!rawDomainData) {
			return;
		}

		if (rawDomainData.subdomains.length > 999) {
			sdk.getSubdomainsById(domainId).then((s) => {
				if (loadingDomainId?.current === domainId) {
					const subs = s.map((sub) => ({
						id: sub.id,
						metadata: sub.metadataUri,
						minter: { id: sub.minter },
						name: sub.name,
						owner: { id: sub.owner },
					}));
					setDomain({
						...{ ...rawDomainData, subdomains: subs },
						...domainMetadata,
					} as DisplayParentDomain);
					setLoading(false);
				} else {
					console.warn('changed domains, ignoring subdomains');
				}
			});
		} else {
			setDomain({
				...rawDomainData,
				...domainMetadata,
			} as DisplayParentDomain);
			setLoading(false);
		}
	}, [rawDomainData, domainMetadata]);

	return { loading, domain, refetch: domainQuery.refetch };
};
