//- React Imports
import React from 'react';

//- Constants Imports
import { AltText } from './Banner.constants';

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
	hasCountdown?: boolean;
	onClick: () => void;
	onFinish: () => void;
};

const Banner: React.FC<BannerProps> = ({
	primaryText,
	secondaryText,
	background,
	buttonText,
	endTime,
	onClick,
	hasCountdown,
	onFinish,
}) => {
	const setCountdownDate = endTime === undefined ? 0 : endTime;

	return (
		<button className={styles.Container} onClick={onClick}>
			{background && (
				<img
					className={styles.Background}
					src={background}
					alt={AltText.BANNER}
				/>
			)}
			<div className={styles.Content}>
				<div className={styles.TextContainer}>
					<h2 className={styles.PrimaryText}>{primaryText}</h2>
					<div className={styles.SecondaryText}>
						{secondaryText}{' '}
						{hasCountdown && (
							<b>
								{setCountdownDate && (
									<Countdown to={setCountdownDate} onFinish={onFinish} />
								)}
							</b>
						)}
					</div>
				</div>

				<p className={styles.ButtonText}>
					{buttonText}
					<img alt={AltText.ARROW} src={arrow} />
				</p>
			</div>
		</button>
	);
};

export default Banner;
