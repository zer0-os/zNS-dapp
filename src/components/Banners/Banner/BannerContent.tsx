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
	timeToShow: number | undefined;
	timeToHide: number | undefined;
	countdownDate?: number;
	actionText?: string;
	backgroundBlob?: string;
	imgAlt?: string;
	onClick: () => void;
	onFinish: () => void;
};

const BannerContent: React.FC<BannerProps> = ({
	title,
	subtext,
	timeToShow,
	timeToHide,
	countdownDate,
	actionText,
	backgroundBlob,
	imgAlt,
	onClick,
	onFinish,
}) => {
	//////////////////
	//    Render    //
	//////////////////

	return (
		<button className={`${styles.Container} border-primary`} onClick={onClick}>
			{backgroundBlob && (
				<img className={styles.Background} src={backgroundBlob} alt={imgAlt} />
			)}
			<div className={styles.Content}>
				<div className={styles.TextContainer}>
					<h2 className={styles.Title}>{title}</h2>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<p className={styles.Label}>
							{subtext}{' '}
							{countdownDate && timeToShow && timeToHide && (
								<b>
									<Countdown to={timeToHide} onFinish={onFinish} />
								</b>
							)}
						</p>
					</div>

					<p className={`${styles.Label} ${styles.Mobile}`}>
						{MOBILE_ALERT_TEXT}
					</p>
				</div>

				<p className={styles.Button}>
					{actionText}
					<img alt={ARROW_ICON_ALT} src={arrow} />
				</p>
			</div>
		</button>
	);
};

export default BannerContent;
