import { useDomainMetadata } from 'lib/hooks/useDomainMetadata';
import { DisplayParentDomain, Maybe } from 'lib/types';
import React from 'react';
import { useDomainByIdQuery } from './zNSDomainHooks';

export const useZnsDomain = (domainId: string) => {
	const [loading, setLoading] = React.useState(true);
	const [domain, setDomain] =
		React.useState<Maybe<DisplayParentDomain>>(undefined);

	const domainQuery = useDomainByIdQuery(domainId);
	const rawDomainData = domainQuery.data?.domain;
	const domainMetadata = useDomainMetadata(rawDomainData?.metadata);

	React.useEffect(() => {
		setLoading(true);
	}, [domainId]);

	React.useEffect(() => {
		if (!rawDomainData) {
			//first queries will always return undefined
			//if after some time keeps the same then get back to home
			setDomain(null);
			setTimeout(() => {
				if (!domain) setLoading(false); //triggers the kickout
			}, 1000);
			return;
		}

		setDomain({
			...rawDomainData,
			...domainMetadata,
		} as DisplayParentDomain);

		setLoading(false);
	}, [rawDomainData, domainMetadata]);

	return { loading, domain, refetch: domainQuery.refetch };
};
