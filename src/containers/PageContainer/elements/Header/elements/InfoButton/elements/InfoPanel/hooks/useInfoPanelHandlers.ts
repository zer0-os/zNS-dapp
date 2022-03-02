import { useCallback, useMemo } from 'react';

type UseInfoPanelHandlersProps = {
	props: {
		onClose: () => void;
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
		props.onClose();
	}, [props]);

	return useMemo(
		() => ({
			handleConnectWallet,
		}),
		[handleConnectWallet],
	);
};
