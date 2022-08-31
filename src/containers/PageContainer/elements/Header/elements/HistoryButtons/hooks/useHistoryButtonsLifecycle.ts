import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';

type UseHistoryButtonsLifecycleProps = {
	props: {
		pathname: string;
	};
	handlers: {
		handleDomainPathChange: () => void;
	};
};

export const useHistoryButtonsLifecycle = ({
	props,
	handlers,
}: UseHistoryButtonsLifecycleProps) => {
	useUpdateEffect(handlers.handleDomainPathChange, [props.pathname]);
};
