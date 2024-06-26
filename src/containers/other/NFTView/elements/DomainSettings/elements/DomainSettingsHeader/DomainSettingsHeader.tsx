import React from 'react';
import { IconButton } from 'components';
import closeIcon from './assets/close-icon.svg';
import './_domain-settings-header.scss';

type DomainSettingsHeaderProps = {
	domainUri: string;
	onClose: () => void;
};

export const DomainSettingsHeader: React.FC<DomainSettingsHeaderProps> = ({
	domainUri,
	onClose,
}) => {
	return (
		<div className="domain-settings__modal-header">
			<h1 className="glow-text-white">My Domain Settings</h1>
			<h2 className="glow-text-white">{domainUri}</h2>
			<IconButton
				className="domain-settings__modal-header--close-icon"
				onClick={onClose}
				iconUri={closeIcon}
			/>
		</div>
	);
};
