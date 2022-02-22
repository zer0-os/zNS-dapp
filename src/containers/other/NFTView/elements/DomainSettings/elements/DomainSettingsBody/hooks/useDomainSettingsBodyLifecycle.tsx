import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';

type UseDomainSettingsBodyLifecycleProps = {
	localState: {
		name: string;
		domain: string;
		story: string;
		isMintable: boolean;
		isBiddable: boolean;
		gridViewByDefault: boolean;
		customDomainHeader: boolean;
		customDomainHeaderText: string;
	};
	handlers: {
		handleDomainNameChange: () => void;
		handleSubDomainNameChange: () => void;
		handleStoryChange: () => void;
		handleCustomDomainHeaderTextChange: () => void;
		handleMetadataChange: () => void;
	};
};

export const useDomainSettingsBodyLifecycle = ({
	localState,
	handlers,
}: UseDomainSettingsBodyLifecycleProps) => {
	useUpdateEffect(handlers.handleDomainNameChange, [localState.name]);

	useUpdateEffect(handlers.handleSubDomainNameChange, [localState.domain]);

	useUpdateEffect(handlers.handleStoryChange, [localState.story]);

	useUpdateEffect(handlers.handleCustomDomainHeaderTextChange, [
		localState.customDomainHeaderText,
	]);

	useUpdateEffect(handlers.handleMetadataChange, [
		localState.name,
		localState.domain,
		localState.story,
		localState.isBiddable,
		localState.isMintable,
		localState.gridViewByDefault,
		localState.customDomainHeader,
		localState.customDomainHeaderText,
	]);
};
