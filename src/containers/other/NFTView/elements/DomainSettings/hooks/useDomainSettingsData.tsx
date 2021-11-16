import { useState, useMemo } from 'react';
import { isNil } from 'lodash';
import { useZnsDomain } from 'lib/hooks/useZnsDomain';
import { getRelativeDomainPath } from 'lib/utils/domains';
import { Maybe } from 'lib/types';
import {
	DomainSettingsWarning,
	DomainSettingsSuccess,
} from '../DomainSettings.constants';

export const useDomainSettingsData = (domainId: string) => {
	const myDomain = useZnsDomain(domainId);
	const parentDomain = useZnsDomain(myDomain.domain?.parent.id || '');

	const [isLocked, setIsLocked] = useState<boolean>(
		isNil(myDomain.domain?.isLocked)
			? true
			: Boolean(myDomain.domain?.isLocked),
	);
	const [isSaved, setIsSaved] = useState<boolean>(false);
	const [warning, setWarning] =
		useState<Maybe<DomainSettingsWarning>>(undefined);
	const [success, setSuccess] =
		useState<Maybe<DomainSettingsSuccess>>(undefined);

	const { domainUri, relativeDomain } = useMemo(() => {
		const domainUri = `0://${myDomain.domain?.name}`;
		const relativeDomain = getRelativeDomainPath(myDomain.domain?.name || '');

		return { domainUri, relativeDomain };
	}, [myDomain.domain?.name]);

	const unavailableDomainNames = useMemo(() => {
		if (parentDomain.domain?.name && parentDomain.domain?.subdomains) {
			return parentDomain.domain?.subdomains
				.filter((subDomain) => subDomain.id !== myDomain.domain?.id)
				.map((subDomain) =>
					subDomain.name
						.replace(parentDomain.domain?.name || '', '')
						.replace('.', ''),
				);
		}

		return [];
	}, [
		myDomain.domain?.id,
		parentDomain.domain?.name,
		parentDomain.domain?.subdomains,
	]);

	return {
		localState: {
			isLocked,
			isSaved,
			warning,
			success,
		},
		localActions: {
			setIsLocked,
			setIsSaved,
			setWarning,
			setSuccess,
		},
		formattedData: {
			myDomain,
			parentDomain,
			domainUri,
			relativeDomain,
			unavailableDomainNames,
		},
	};
};
