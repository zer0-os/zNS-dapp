import React from 'react';

import styles from './ProfileButton.module.css';

const ProfileButton = (props) => {
	return (
		<button style={props.style} className={styles.ProfileButton}>
			<img alt="your profile" src={props.icon} />
		</button>
	);
};

export default ProfileButton;
