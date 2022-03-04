import { useCallback, useMemo } from 'react';

type UseInfoPanelHandlersProps = {
	props: {
		onConnectWallet: () => void;
	};
};

type UseInfoPanelHandlersReturn = {
	handleConnectWallet: () => void;
};

export const useInfoPanelHandlers = ({
	props,
}: UseInfoPanelHandlersProps): UseInfoPanelHandlersReturn => {
	const handleConnectWallet = useCallback(() => {
		props.onConnectWallet();
	}, [props]);

	return useMemo(
		() => ({
			handleConnectWallet,
		}),
		[handleConnectWallet],
	);
};
