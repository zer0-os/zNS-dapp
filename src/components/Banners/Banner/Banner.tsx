//- React Imports
import React from 'react';

//- Constants Imports
import { ALT_TEXT } from './Banner.constants';

//- Components Imports
import Countdown from 'components/Countdown/Countdown';

//- Assets Imports
import arrow from './assets/bidarrow.svg';

//- Style Imports
import styles from './Banner.module.scss';

type BannerProps = {
	primaryText?: string;
	secondaryText?: string;
	background?: string;
	buttonText?: string;
	endTime?: number;
	isCountdown: boolean;
	onClick: () => void;
	onFinish: () => void;
	style?: React.CSSProperties;
};

const Banner: React.FC<BannerProps> = ({
	primaryText,
	secondaryText,
	background,
	buttonText,
	endTime,
	onClick,
	isCountdown,
	onFinish,
	style,
}) => {
	const setCountdownDate = endTime === undefined ? 0 : endTime;

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
					<div className={styles.SecondaryText}>
						{secondaryText}{' '}
						{isCountdown && (
							<b>
								{/* Banner Countdown */}
								{setCountdownDate && (
									<Countdown to={setCountdownDate} onFinish={onFinish} />
								)}
							</b>
						)}
					</div>
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
