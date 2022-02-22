import { useMemo, useCallback } from 'react';
import { DomainMetadata } from '@zero-tech/zns-sdk/lib/types';
import { Maybe } from 'lib/types';
import {
	DomainSettingsError,
	ERROR_KEYS,
	ERROR_TYPES,
	ERROR_MESSAGES,
} from '../DomainSettingsBody.constants';

type UseDomainSettingsBodyHandlersProps = {
	props: {
		isLocked: boolean;
		metadata: Maybe<DomainMetadata>;
		unavailableDomainNames: string[];
		onShowLockedWarning: () => void;
		onMetadataChange: (metadata: DomainMetadata) => void;
	};
	localState: {
		name: string;
		domain: string;
		story: string;
		errors: DomainSettingsError;
		isMintable: boolean;
		isBiddable: boolean;
		gridViewByDefault: boolean;
		customDomainHeader: boolean;
		customDomainHeaderValue: string;
	};
	localActions: {
		setErrors: React.Dispatch<React.SetStateAction<DomainSettingsError>>;
	};
	formattedData: {
		isChanged: boolean;
	};
};

export const useDomainSettingsBodyHandlers = ({
	props,
	localState,
	localActions,
	formattedData,
}: UseDomainSettingsBodyHandlersProps) => {
	const handleBodyClicking = useCallback(() => {
		if (props.isLocked) {
			props.onShowLockedWarning();
		}
	}, [props]);

	const handleDomainNameChange = useCallback(() => {
		if (!localState.name) {
			localActions.setErrors({
				...localState.errors,
				[ERROR_KEYS.NAME]:
					ERROR_MESSAGES[ERROR_KEYS.NAME][ERROR_TYPES.REQUIRED],
			});
		} else {
			localActions.setErrors({
				...localState.errors,
				[ERROR_KEYS.NAME]: undefined,
			});
		}
	}, [localState, localActions]);

	const handleSubDomainNameChange = useCallback(() => {
		if (!localState.domain) {
			localActions.setErrors({
				...localState.errors,
				[ERROR_KEYS.SUB_DOMAIN]:
					ERROR_MESSAGES[ERROR_KEYS.SUB_DOMAIN][ERROR_TYPES.REQUIRED],
			});
		} else if (props.unavailableDomainNames.includes(localState.domain)) {
			localActions.setErrors({
				...localState.errors,
				[ERROR_KEYS.SUB_DOMAIN]:
					ERROR_MESSAGES[ERROR_KEYS.SUB_DOMAIN][ERROR_TYPES.DUPLICATED],
			});
		} else if (/[A-Z]/.test(localState.domain)) {
			localActions.setErrors({
				...localState.errors,
				[ERROR_KEYS.SUB_DOMAIN]:
					ERROR_MESSAGES[ERROR_KEYS.SUB_DOMAIN][ERROR_TYPES.LOWER_CASE],
			});
		} else {
			localActions.setErrors({
				...localState.errors,
				[ERROR_KEYS.SUB_DOMAIN]: undefined,
			});
		}
	}, [props, localState, localActions]);

	const handleStoryChange = useCallback(() => {
		if (!localState.story) {
			localActions.setErrors({
				...localState.errors,
				[ERROR_KEYS.STORY]:
					ERROR_MESSAGES[ERROR_KEYS.STORY][ERROR_TYPES.REQUIRED],
			});
		} else {
			localActions.setErrors({
				...localState.errors,
				[ERROR_KEYS.STORY]: undefined,
			});
		}
	}, [localState, localActions]);

	const handleCustomDomainHeaderValueChange = useCallback(() => {
		if (localState.customDomainHeader) {
			if (!localState.customDomainHeaderValue) {
				localActions.setErrors({
					...localState.errors,
					[ERROR_KEYS.CUSTOM_DOMAIN_HEADER]:
						ERROR_MESSAGES[ERROR_KEYS.CUSTOM_DOMAIN_HEADER][
							ERROR_TYPES.REQUIRED
						],
				});
			} else {
				localActions.setErrors({
					...localState.errors,
					[ERROR_KEYS.CUSTOM_DOMAIN_HEADER]: undefined,
				});
			}
		}
	}, [localState, localActions]);

	const handleMetadataChange = useCallback(() => {
		const {
			name,
			domain,
			story,
			isMintable,
			isBiddable,
			gridViewByDefault,
			customDomainHeader,
			customDomainHeaderValue,
		} = localState;

		if (
			!!name &&
			!!domain &&
			!!story &&
			(!customDomainHeader ||
				(customDomainHeader && !!customDomainHeaderValue)) &&
			formattedData.isChanged
		) {
			props.onMetadataChange({
				...props.metadata!,
				name,
				domain,
				description: story,
				isMintable,
				isBiddable,
				gridViewByDefault,
				customDomainHeader,
				customDomainHeaderValue,
			});
		}
	}, [props, localState, formattedData]);

	return useMemo(
		() => ({
			handleBodyClicking,
			handleDomainNameChange,
			handleSubDomainNameChange,
			handleStoryChange,
			handleCustomDomainHeaderValueChange,
			handleMetadataChange,
		}),
		[
			handleBodyClicking,
			handleDomainNameChange,
			handleSubDomainNameChange,
			handleStoryChange,
			handleCustomDomainHeaderValueChange,
			handleMetadataChange,
		],
	);
};
