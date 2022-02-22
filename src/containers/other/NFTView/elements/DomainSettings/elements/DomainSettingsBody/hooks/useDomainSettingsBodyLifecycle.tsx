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
		customDomainHeaderValue: string;
	};
	handlers: {
		handleDomainNameChange: () => void;
		handleSubDomainNameChange: () => void;
		handleStoryChange: () => void;
		handleCustomDomainHeaderValueChange: () => void;
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

	useUpdateEffect(handlers.handleCustomDomainHeaderValueChange, [
		localState.customDomainHeaderValue,
	]);

	useUpdateEffect(handlers.handleMetadataChange, [
		localState.name,
		localState.domain,
		localState.story,
		localState.isBiddable,
		localState.isMintable,
		localState.gridViewByDefault,
		localState.customDomainHeader,
		localState.customDomainHeaderValue,
	]);
};
