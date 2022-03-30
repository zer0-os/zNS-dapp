import { useMemo, useCallback } from 'react';
import { History } from 'history';

type UseHistoryButtonsHandlersProps = {
	props: {
		pathname: string;
		history: History<unknown>;
	};
	localState: {
		forwardDomain: string | undefined;
	};
	localActions: {
		setForwardDomain: React.Dispatch<React.SetStateAction<string | undefined>>;
	};
	refs: {
		lastDomainRef: React.MutableRefObject<string | undefined>;
	};
};

type UseHistoryButtonsHandlersReturn = {
	handleOnBackClick: () => void;
	handleOnForwardClick: () => void;
	handleDomainPathChange: () => void;
};

export const useHistoryButtonsHandlers = ({
	props,
	localState,
	localActions,
	refs,
}: UseHistoryButtonsHandlersProps): UseHistoryButtonsHandlersReturn => {
	const handleOnBackClick = useCallback(() => {
		const { history, pathname } = props;

		const lastIndex = pathname.lastIndexOf('.');
		if (lastIndex > 0) {
			history.push(pathname.slice(0, pathname.lastIndexOf('.')));
		} else {
			history.push(pathname.slice(0, pathname.lastIndexOf('/')));
		}
	}, [props]);

	const handleOnForwardClick = useCallback(() => {
		if (localState.forwardDomain) {
			props.history.push(localState.forwardDomain);
		}
		localActions.setForwardDomain(undefined);
	}, [props, localState, localActions]);

	const handleDomainPathChange = useCallback(() => {
		if (refs.lastDomainRef.current) {
			if (refs.lastDomainRef.current.length > props.pathname.length) {
				localActions.setForwardDomain(refs.lastDomainRef.current);
			} else {
				localActions.setForwardDomain(undefined);
			}
		}
		refs.lastDomainRef.current = props.pathname;
	}, [props, localActions, refs]);

	return useMemo(
		() => ({
			handleOnBackClick,
			handleOnForwardClick,
			handleDomainPathChange,
		}),
		[handleOnBackClick, handleOnForwardClick, handleDomainPathChange],
	);
};
