import { useState } from 'react';
import { DomainMetadata } from '@zero-tech/zns-sdk/lib/types';
import { DisplayDomain, Maybe } from 'lib/types';
import { usePropsState } from 'lib/hooks/usePropsState';
import { DomainSettingsError } from '../DomainSettingsBody.constants';

export const useDomainSettingsBodyData = (
	currentDomain: Maybe<DisplayDomain>,
	metadata: Maybe<DomainMetadata>,
) => {
	const [name, setName] = usePropsState<string>(metadata?.name || '');
	const [domain, setDomain] = usePropsState<string>(
		(metadata?.domain as string) ||
			currentDomain?.name
				.replace(currentDomain.parent?.name || '', '')
				.replace('.', '') ||
			'',
	);
	const [story, setStory] = usePropsState<string>(metadata?.description || '');
	const [errors, setErrors] = useState<DomainSettingsError>({});
	/* Switches */
	const [isMintable, setIsMintable] = usePropsState<boolean>(
		Boolean(metadata?.isMintable),
	);
	const [isBiddable, setIsBiddable] = usePropsState<boolean>(
		Boolean(metadata?.isBiddable),
	);
	const [gridViewByDefault, setGridViewByDefault] = usePropsState<boolean>(
		Boolean(metadata?.gridViewByDefault),
	);
	const [customDomainHeader, setCustomDomainHeader] = usePropsState<boolean>(
		Boolean(metadata?.customDomainHeader),
	);

	return {
		localState: {
			name,
			domain,
			story,
			errors,
			/* Switches */
			isMintable,
			isBiddable,
			gridViewByDefault,
			customDomainHeader,
		},
		localActions: {
			setName,
			setDomain,
			setStory,
			setErrors,
			/* Switches */
			setIsMintable,
			setIsBiddable,
			setGridViewByDefault,
			setCustomDomainHeader,
		},
	};
};
