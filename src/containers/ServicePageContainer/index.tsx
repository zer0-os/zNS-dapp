//- React Imports
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

//- Constants Imports
import { ALT_TEXT } from './ServicePageContainer.constants';
import { ROUTES } from 'constants/routes';

//- Styles Imports
import styles from './ServicePageContainer.module.scss';

//- Asset Imports
import backgroundImage from 'assets/background.jpg';
import networkLogo from 'assets/WWLogo_SVG.svg';

type ServicePageContainerProps = {
	children: React.ReactNode;
};

const ServicePageContainer: React.FC<ServicePageContainerProps> = ({
	children,
}) => {
	// Update background image
	useEffect(() => {
		// Background Image ID - index.html
		const loadImg = new Image();
		loadImg.src = backgroundImage;
		if (loadImg.complete) {
			document.body.style.backgroundImage = `url(${backgroundImage})`;
		} else {
			loadImg.onload = () => {
				const bg = document.getElementById('backgroundImage')?.style;
				if (!bg) return;
				bg.backgroundImage = `url(${backgroundImage})`;
				bg.opacity = '1';
			};
		}
	}, []);

	return (
		<>
			<div className={styles.ServicePageContainer}>
				<div className={styles.BackgroundContainer} />
				<div className={styles.BackgroundImage} />
				<main className={styles.Main}>
					<nav className={styles.NavBar}>
						<Link className={styles.HomeLink} to={ROUTES.MARKET}>
							<img
								alt={ALT_TEXT.NETWORK_LOGO}
								src={networkLogo}
								className={styles.Logo}
							/>
						</Link>
					</nav>
					{children}
				</main>
			</div>
		</>
	);
};
export default ServicePageContainer;
