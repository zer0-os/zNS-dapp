import React from 'react';
import { IconDot, InfoPanel } from './elements';
import './_info-button.scss';

export type InfoButtonProps = {
	isDesktop: boolean;
	onConnectWallet: () => void;
};

export const InfoButton: React.FC<InfoButtonProps> = (props) => {
	return (
		<div className="info-button__container">
			<button className="info-button">
				<IconDot />
			</button>

			<InfoPanel {...props} />
		</div>
	);
};
