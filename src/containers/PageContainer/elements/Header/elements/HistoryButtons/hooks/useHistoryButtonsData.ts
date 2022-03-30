import { useState, useRef, useMemo } from 'react';

type UseHistoryButtonsDataProps = {
	props: {
		pathname: string;
	};
};

type UseHistoryButtonsDataReturn = {
	localState: {
		forwardDomain: string | undefined;
	};
	localActions: {
		setForwardDomain: React.Dispatch<React.SetStateAction<string | undefined>>;
	};
	formattedData: {
		canGoBack: boolean;
		canGoForward: boolean;
	};
	refs: {
		lastDomainRef: React.MutableRefObject<string | undefined>;
	};
};

export const useHistoryButtonsData = ({
	props,
}: UseHistoryButtonsDataProps): UseHistoryButtonsDataReturn => {
	const lastDomainRef = useRef<string>();
	const [forwardDomain, setForwardDomain] = useState<string | undefined>();

	const formattedData = useMemo(() => {
		const canGoBack = props.pathname !== undefined && props.pathname !== '/';
		const canGoForward = Boolean(forwardDomain);

		return {
			canGoBack,
			canGoForward,
		};
	}, [props, forwardDomain]);

	return {
		localState: {
			forwardDomain,
		},
		localActions: {
			setForwardDomain,
		},
		formattedData,
		refs: {
			lastDomainRef,
		},
	};
};
