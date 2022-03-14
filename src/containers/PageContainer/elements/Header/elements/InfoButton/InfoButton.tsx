//- React Imports
import React from 'react';

//- Info Element Imports
import { IconDot, InfoPanel } from './elements';

//- Assets Imports
import './_info-button.scss';

//- Components Imports
import { HoverDropDown } from 'components';

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
