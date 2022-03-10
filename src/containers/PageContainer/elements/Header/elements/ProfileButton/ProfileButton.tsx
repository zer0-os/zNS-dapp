import React from 'react';
import { IconButton } from 'components';
import userIcon from 'assets/user.svg';
import './_profile-button.scss';

type ProfileButtonProps = {
	onOpenProfile: () => void;
};

export const ProfileButton: React.FC<ProfileButtonProps> = ({
	onOpenProfile,
}) => {
	return (
		<IconButton
			className="profile-button"
			iconUri={userIcon}
			onClick={onOpenProfile}
		/>
	);
};
