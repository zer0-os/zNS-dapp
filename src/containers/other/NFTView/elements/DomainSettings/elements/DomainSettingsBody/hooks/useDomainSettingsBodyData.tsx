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
		const isBiddable = true;
		const gridViewByDefault = true;
		const customDomainHeader = Boolean(metadata?.customDomainHeader);
		const customDomainHeaderValue =
			(metadata?.customDomainHeaderValue as string) || '';

		return {
			name,
			domain,
			story,
			isMintable,
			isBiddable,
			gridViewByDefault,
			customDomainHeader,
			customDomainHeaderValue,
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
	const [customDomainHeaderValue, setCustomDomainHeaderValue] =
		usePropsState<string>(initialDomainSettings.customDomainHeaderValue);

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
			customDomainHeaderValue,
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
			customDomainHeaderValue,
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
			setCustomDomainHeaderValue,
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
			setCustomDomainHeaderValue,
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
		const customDomainHeaderValueChanged =
			initialDomainSettings.customDomainHeaderValue !==
			localState.customDomainHeaderValue;

		return (
			nameChanged ||
			domainChanged ||
			storyChanged ||
			isMintableChanged ||
			isBiddableChanged ||
			gridViewByDefaultChanged ||
			customDomainHeaderChanged ||
			customDomainHeaderValueChanged
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
