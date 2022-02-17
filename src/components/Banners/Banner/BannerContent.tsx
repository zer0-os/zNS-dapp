//- React Imports
import React from 'react';

//- Component Imports
import { Countdown } from 'components';

//- Style Imports
import styles from './Banner.module.scss';

//- Assets Imports
import arrow from './assets/bidarrow.svg';

//- Constant Imports
import { MOBILE_ALERT_TEXT, ARROW_ICON_ALT } from './constants';

export type BannerProps = {
	title: string | undefined;
	subtext: string | undefined;
	countdownDate?: number;
	actionText?: string;
	backgroundBlob?: string;
	imgAlt?: string;
	shouldDisplayCountdown: boolean;
	onClick: () => void;
	onFinish: () => void;
};

const BannerContent: React.FC<BannerProps> = ({
	title,
	subtext,
	countdownDate,
	actionText,
	backgroundBlob,
	imgAlt,
	shouldDisplayCountdown,
	onClick,
	onFinish,
}) => {
	const setCountdownDate = countdownDate === undefined ? 0 : countdownDate;

	//////////////////
	//    Render    //
	//////////////////

	return (
		<button className={`${styles.Container} border-primary`} onClick={onClick}>
			{backgroundBlob && (
				<img className={styles.Background} src={backgroundBlob} alt={imgAlt} />
			)}
			<div className={styles.Content}>
				{/* Banner Title */}
				<div className={styles.TextContainer}>
					<h2 className={styles.Title}>{title}</h2>

					{/* Banner Subtext */}
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<p className={styles.Label}>
							{subtext}{' '}
							{shouldDisplayCountdown && (
								<b>
									{/* Banner Countdown */}
									<Countdown to={setCountdownDate} onFinish={onFinish} />
								</b>
							)}
						</p>
					</div>

					{/* Mobile Screen Size */}
					<p className={`${styles.Label} ${styles.Mobile}`}>
						{MOBILE_ALERT_TEXT}
					</p>
				</div>

				{/* Banner Action */}
				{actionText && (
					<p className={styles.Button}>
						{actionText}
						<img alt={ARROW_ICON_ALT} src={arrow} />
					</p>
				)}
			</div>
		</button>
	);
};

export default BannerContent;
