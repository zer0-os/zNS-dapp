import React from 'react';
import { IconDot, InfoPanel } from './elements';
import './_info-button.scss';

import HoverDropDown from 'components/HoverDropDown/HoverDropDown';

export type InfoButtonProps = {
	isDesktop: boolean;
	onConnectWallet: () => void;
};

export const InfoButton: React.FC<InfoButtonProps> = (props) => {
	/////////////////////
	// React Fragments //
	/////////////////////
	const dropdownButton = (
		<div className="info-button__container">
			<button className="info-button">
				<IconDot />
			</button>
		</div>
	);

	const dropdownContent = <InfoPanel {...props} />;

	////////////
	// Render //
	////////////
	return (
		<HoverDropDown triggerContent={dropdownButton}>
			{dropdownContent}
		</HoverDropDown>
	);
};
