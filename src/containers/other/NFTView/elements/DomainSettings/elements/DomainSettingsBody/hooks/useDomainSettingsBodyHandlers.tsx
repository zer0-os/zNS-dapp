import {
	DomainSettingsError,
	ERROR_KEYS,
	ERROR_TYPES,
	ERROR_MESSAGES,
} from '../DomainSettingsBody.constants';

type UseDomainSettingsBodyHandlersProps = {
	props: {
		isLocked: boolean;
		unavailableDomainNames: string[];
		onShowLockedWarning: () => void;
	};
	localState: {
		name: string;
		domain: string;
		story: string;
		errors: DomainSettingsError;
	};
	localActions: {
		setErrors: React.Dispatch<React.SetStateAction<DomainSettingsError>>;
	};
};

export const useDomainSettingsBodyHandlers = ({
	props,
	localState,
	localActions,
}: UseDomainSettingsBodyHandlersProps) => {
	const handleBodyClicking = () => {
		if (props.isLocked) {
			props.onShowLockedWarning();
		}
	};

	const handleDomainNameChange = () => {
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
	};

	const handleSubDomainNameChange = () => {
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
	};

	const handleStoryChange = () => {
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
	};

	return {
		handleBodyClicking,
		handleDomainNameChange,
		handleSubDomainNameChange,
		handleStoryChange,
	};
};
