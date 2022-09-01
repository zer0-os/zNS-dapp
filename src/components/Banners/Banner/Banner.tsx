//- React Imports
import React from 'react';

//- Constants Imports
import { ALT_TEXT } from './Banner.constants';

//- Assets Imports
import arrow from './assets/bidarrow.svg';

//- Style Imports
import styles from './Banner.module.scss';

type BannerProps = {
	primaryText?: string;
	secondaryText?: React.ReactNode;
	background?: string;
	buttonText?: string;
	onClick?: (event: any) => void;
	style?: React.CSSProperties;
};

const Banner: React.FC<BannerProps> = ({
	primaryText,
	secondaryText,
	background,
	buttonText,
	onClick,
	style,
}) => {
	return (
		<button className={styles.Container} style={style} onClick={onClick}>
			<img
				className={styles.Background}
				src={background}
				alt={ALT_TEXT.BANNER}
			/>
			<div className={styles.Content}>
				<div className={styles.TextContainer}>
					<h2 className={styles.PrimaryText}>{primaryText}</h2>
					<div className={styles.SecondaryText}>{secondaryText}</div>
				</div>

				<p className={styles.ButtonText}>
					{buttonText}
					<img alt={ALT_TEXT.ARROW} src={arrow} />
				</p>
			</div>
		</button>
	);
};

export default Banner;
