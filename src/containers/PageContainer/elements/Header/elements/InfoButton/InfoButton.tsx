import React from 'react';
import { IconButton } from 'components';
import dotIcon from 'assets/dot-icon.svg';
import './_info-button.scss';

type InfoButtonProps = {
	onClick: () => void;
};

export const InfoButton: React.FC<InfoButtonProps> = ({ onClick }) => {
	return (
		<IconButton className="info-button" iconUri={dotIcon} onClick={onClick} />
	);
};
