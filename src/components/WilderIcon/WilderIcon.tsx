//- React Imports
import React from 'react';
import { useHistory } from 'react-router-dom';

//- Style Imports
import styles from './WilderIcon.module.scss';

//- Asset Imports
import wilderIcon from './assets/WWLogo_SVG.svg';

const WilderIcon: React.FC = () => {
	//- Hooks
	const history = useHistory();

	const redirectToHome = () => {
		history.push('/');
	};

	return (
		<div className={styles.Wilder}>
			<img alt="home icon" src={wilderIcon} onClick={redirectToHome} />
		</div>
	);
};

export default WilderIcon;
