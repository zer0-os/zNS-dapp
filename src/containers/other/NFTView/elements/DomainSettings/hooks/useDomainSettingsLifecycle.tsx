import { Web3Provider } from '@ethersproject/providers';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { DisplayParentDomain } from 'lib/types';

type UseDomainSettingsLifecycleProps = {
	props: {
		domain: DisplayParentDomain;
		library: Web3Provider | undefined;
	};
	handlers: {
		handleFetchMetadata: () => Promise<void>;
		handleCheckAndSetDomainMetadataLockStatus: () => Promise<void>;
	};
};

export const useDomainSettingsLifecycle = ({
	props,
	handlers,
}: UseDomainSettingsLifecycleProps) => {
	useUpdateEffect(handlers.handleFetchMetadata, [props.domain?.id]);

	useUpdateEffect(handlers.handleCheckAndSetDomainMetadataLockStatus, [props]);
};
