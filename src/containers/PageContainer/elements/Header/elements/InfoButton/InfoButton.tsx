import React, { useState, useRef, useCallback } from 'react';
import { useOnClickOutside } from 'lib/hooks/useOnClickOutside';
import { IconDot, InfoPanel } from './elements';
import './_info-button.scss';

export type InfoButtonProps = {
	isDesktop: boolean;
	onConnectWallet: () => void;
};

export const InfoButton: React.FC<InfoButtonProps> = (props) => {
	const infoPanelRef = useRef<HTMLDivElement>(null);

	const [isOpen, setIsOpen] = useState(false);

	const handleOnToggle = useCallback(() => {
		setIsOpen(!isOpen);
	}, [setIsOpen, isOpen]);

	const handleClose = useCallback(() => {
		setIsOpen(false);
	}, [setIsOpen]);

	useOnClickOutside(infoPanelRef, handleClose);

	return (
		<div className="info-button__container" ref={infoPanelRef}>
			<button className="info-button" onClick={handleOnToggle}>
				<IconDot />
			</button>

			{isOpen && <InfoPanel onClose={handleClose} {...props} />}
		</div>
	);
};
