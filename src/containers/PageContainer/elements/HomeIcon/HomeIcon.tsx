import React from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTES } from 'constants/routes';
import wilderIcon from 'assets/WWLogo_SVG.svg';
import styles from './_home-icon.module.scss';

export const HomeIcon: React.FC = () => {
	const history = useHistory();

	const onClick = () => {
		history.push(ROUTES.MARKET);
	};

	return (
		<div className={styles.Wilder}>
			<img alt="home icon" src={wilderIcon} onClick={onClick} />
		</div>
	);
};
