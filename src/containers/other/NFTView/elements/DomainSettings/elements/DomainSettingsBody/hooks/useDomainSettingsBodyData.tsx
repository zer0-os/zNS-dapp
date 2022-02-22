import { useMemo, useState } from 'react';
import { DomainMetadata } from '@zero-tech/zns-sdk/lib/types';
import { DisplayDomain, Maybe } from 'lib/types';
import { usePropsState } from 'lib/hooks/usePropsState';
import { DomainSettingsError } from '../DomainSettingsBody.constants';

export const useDomainSettingsBodyData = (
	currentDomain: Maybe<DisplayDomain>,
	metadata: Maybe<DomainMetadata>,
) => {
	const initialDomainSettings = useMemo(() => {
		const name = metadata?.name || currentDomain?.title || '';
		const domain =
			(metadata?.domain as string) ||
			currentDomain?.name
				.replace(currentDomain.parent?.name || '', '')
				.replace('.', '') ||
			'';
		const story = metadata?.description || '';
		const isMintable = Boolean(metadata?.isMintable);
		const isBiddable = Boolean(metadata?.isBiddable);
		const gridViewByDefault = Boolean(metadata?.gridViewByDefault);
		const customDomainHeader = Boolean(metadata?.customDomainHeader);
		const customDomainHeaderText =
			(metadata?.customDomainHeaderText as string) || '';

		return {
			name,
			domain,
			story,
			isMintable,
			isBiddable,
			gridViewByDefault,
			customDomainHeader,
			customDomainHeaderText,
		};
	}, [currentDomain, metadata]);

	const [name, setName] = usePropsState<string>(initialDomainSettings.name);
	const [domain, setDomain] = usePropsState<string>(
		initialDomainSettings.domain,
	);
	const [story, setStory] = usePropsState<string>(initialDomainSettings.story);
	const [errors, setErrors] = useState<DomainSettingsError>({});
	/* Switches */
	const [isMintable, setIsMintable] = usePropsState<boolean>(
		initialDomainSettings.isMintable,
	);
	const [isBiddable, setIsBiddable] = usePropsState<boolean>(
		initialDomainSettings.isBiddable,
	);
	const [gridViewByDefault, setGridViewByDefault] = usePropsState<boolean>(
		initialDomainSettings.gridViewByDefault,
	);
	const [customDomainHeader, setCustomDomainHeader] = usePropsState<boolean>(
		initialDomainSettings.customDomainHeader,
	);
	const [customDomainHeaderText, setCustomDomainHeaderText] =
		usePropsState<string>(initialDomainSettings.customDomainHeaderText);

	const localState = useMemo(
		() => ({
			name,
			domain,
			story,
			errors,
			isMintable,
			isBiddable,
			gridViewByDefault,
			customDomainHeader,
			customDomainHeaderText,
		}),
		[
			name,
			domain,
			story,
			errors,
			isMintable,
			isBiddable,
			gridViewByDefault,
			customDomainHeader,
			customDomainHeaderText,
		],
	);

	const localActions = useMemo(
		() => ({
			setName,
			setDomain,
			setStory,
			setErrors,
			setIsMintable,
			setIsBiddable,
			setGridViewByDefault,
			setCustomDomainHeader,
			setCustomDomainHeaderText,
		}),
		[
			setName,
			setDomain,
			setStory,
			setErrors,
			setIsMintable,
			setIsBiddable,
			setGridViewByDefault,
			setCustomDomainHeader,
			setCustomDomainHeaderText,
		],
	);

	const isChanged = useMemo(() => {
		const nameChanged = initialDomainSettings.name !== localState.name;
		const domainChanged = initialDomainSettings.domain !== localState.domain;
		const storyChanged = initialDomainSettings.story !== localState.story;
		const isMintableChanged =
			initialDomainSettings.isMintable !== localState.isMintable;
		const isBiddableChanged =
			initialDomainSettings.isBiddable !== localState.isBiddable;
		const gridViewByDefaultChanged =
			initialDomainSettings.gridViewByDefault !== localState.gridViewByDefault;
		const customDomainHeaderChanged =
			initialDomainSettings.customDomainHeader !==
			localState.customDomainHeader;
		const customDomainHeaderTextChanged =
			initialDomainSettings.customDomainHeaderText !==
			localState.customDomainHeaderText;

		return (
			nameChanged ||
			domainChanged ||
			storyChanged ||
			isMintableChanged ||
			isBiddableChanged ||
			gridViewByDefaultChanged ||
			customDomainHeaderChanged ||
			customDomainHeaderTextChanged
		);
	}, [initialDomainSettings, localState]);

	return {
		localState,
		localActions,
		formattedData: {
			isChanged,
		},
	};
};
