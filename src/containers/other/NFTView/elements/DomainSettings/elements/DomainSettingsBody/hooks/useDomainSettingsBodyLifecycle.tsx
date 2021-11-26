import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';

type UseDomainSettingsBodyLifecycleProps = {
	localState: {
		name: string;
		domain: string;
		story: string;
	};
	handlers: {
		handleDomainNameChange: () => void;
		handleSubDomainNameChange: () => void;
		handleStoryChange: () => void;
	};
};

export const useDomainSettingsBodyLifecycle = ({
	localState,
	handlers,
}: UseDomainSettingsBodyLifecycleProps) => {
	useUpdateEffect(handlers.handleDomainNameChange, [localState.name]);

	useUpdateEffect(handlers.handleSubDomainNameChange, [localState.domain]);

	useUpdateEffect(handlers.handleStoryChange, [localState.story]);
};
