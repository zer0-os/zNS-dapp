import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { DisplayParentDomain } from 'lib/types';
import { Registrar } from 'types/Registrar';

type UseDomainSettingsLifecycleProps = {
	props: {
		domain: DisplayParentDomain;
		registrar: Registrar;
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
