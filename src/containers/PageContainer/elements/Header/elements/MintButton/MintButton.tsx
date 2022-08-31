import React, { useCallback } from 'react';
import { FutureButton } from 'components';
import './_mint-button.scss';

type MintButtonProps = {
	isMinting: boolean;
	onClick: () => void;
};

export const MintButton: React.FC<MintButtonProps> = ({
	isMinting,
	onClick,
}) => {
	const handleClick = useCallback(() => {
		if (!isMinting) {
			onClick();
		}
	}, [isMinting, onClick]);

	return (
		<FutureButton
			glow={!isMinting}
			onClick={handleClick}
			className="mint-button"
		>
			Mint
		</FutureButton>
	);
};
