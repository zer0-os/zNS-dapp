import { useState, useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { DomainMetadata } from '@zero-tech/zns-sdk/lib/types';
import { useZnsDomain } from 'lib/hooks/useZnsDomain';
import { useCurrentDomain } from 'lib/providers/CurrentDomainProvider';
import { getRelativeDomainPath } from 'lib/utils/domains';
import { useZnsContracts } from 'lib/contracts';
import { Maybe } from 'lib/types';
import {
	DomainSettingsWarning,
	DomainSettingsSuccess,
} from '../DomainSettings.constants';

export const useDomainSettingsData = (domainId: string) => {
	const { account } = useWeb3React<Web3Provider>();

	const myDomain = useZnsDomain(domainId);
	const { domainId: znsDomainId, setDomainMetadata } = useCurrentDomain();
	const parentDomain = useZnsDomain(myDomain.domain?.parent.id || '');

	const znsContracts = useZnsContracts()!;
	const registrar = znsContracts.registry;

	const [isLocked, setIsLocked] = useState<boolean>(true);
	const [isChanged, setIsChanged] = useState<boolean>(false);
	const [isSaved, setIsSaved] = useState<boolean>(false);
	const [warning, setWarning] =
		useState<Maybe<DomainSettingsWarning>>(undefined);
	const [success, setSuccess] =
		useState<Maybe<DomainSettingsSuccess>>(undefined);
	const [metadata, setMetadata] = useState<Maybe<DomainMetadata>>(undefined);
	const [localMetadata, setLocalMetadata] =
		useState<Maybe<DomainMetadata>>(undefined);

	const isZnsDomain = useMemo(
		() => znsDomainId.toString() === domainId.toString(),
		[domainId, znsDomainId],
	);

	const { domainUri, relativeDomain } = useMemo(() => {
		const domainUri = `0://${myDomain.domain?.name}`;
		const relativeDomain = getRelativeDomainPath(myDomain.domain?.name || '');

		return { domainUri, relativeDomain };
	}, [myDomain.domain?.name]);

	const unlockable = useMemo(() => {
		const isDomainOwnedByMe =
			myDomain.domain?.owner.id.toLowerCase() === account?.toLowerCase();
		const isLocked = myDomain.domain?.isLocked;
		const hasLockedBy = Boolean(myDomain.domain?.lockedBy);

		if (!hasLockedBy) return isDomainOwnedByMe;

		const isDomainLockedByMe = isLocked
			? myDomain.domain?.lockedBy?.id.toLowerCase() === account?.toLowerCase()
			: isDomainOwnedByMe;

		return isDomainOwnedByMe && isDomainLockedByMe;
	}, [myDomain.domain, account]);

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
			isChanged,
			isSaved,
			warning,
			success,
			metadata,
			localMetadata,
		},
		localActions: {
			setIsLocked,
			setIsChanged,
			setIsSaved,
			setWarning,
			setSuccess,
			setMetadata,
			setLocalMetadata,
		},
		formattedData: {
			isZnsDomain,
			myDomain,
			parentDomain,
			domainUri,
			relativeDomain,
			unavailableDomainNames,
			unlockable,
		},
		registrar,
		setDomainMetadata,
	};
};
