import { useState, useMemo } from 'react';
import { useZnsDomain } from 'lib/hooks/useZnsDomain';
import { useDomainMetadata } from 'lib/hooks/useDomainMetadata';
import { getRelativeDomainPath } from 'lib/utils/domains';
import { useZnsContracts } from 'lib/contracts';
import { Maybe } from 'lib/types';
import {
	DomainSettingsWarning,
	DomainSettingsSuccess,
} from '../DomainSettings.constants';

export const useDomainSettingsData = (domainId: string) => {
	const myDomain = useZnsDomain(domainId);
	const parentDomain = useZnsDomain(myDomain.domain?.parent.id || '');
	const metadata = useDomainMetadata(myDomain.domain?.metadata);

	const znsContracts = useZnsContracts()!;
	const registrar = znsContracts.registry;

	const [isLocked, setIsLocked] = useState<boolean>(true);
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
			metadata,
			domainUri,
			relativeDomain,
			unavailableDomainNames,
		},
		registrar,
	};
};
