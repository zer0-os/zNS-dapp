//- React Imports
import React from 'react';

//- Style Imports
import styles from './MessageBanner.module.scss';

//- Assets Imports
import arrow from './assets/bidarrow.svg';

//- Components Imports
import { Countdown } from 'components';

type MessageBannerProps = {
	label: React.ReactNode;
	buttonText: string;
	countdownTime: number;
};

const MessageBanner: React.FC<MessageBannerProps> = ({
	label,
	buttonText,
	countdownTime,
}) => {
	return (
		<div className={`${styles.Container}`}>
			<div className={`${styles.Content}`}>
				<p className={`${styles.Label}`}>{label}</p>
				<div className={`${styles.Countdown}`}>
					<Countdown to={countdownTime} />
				</div>
				<p className={`${styles.Button}`}>
					{buttonText}
					<img alt="arrow" src={arrow} />
				</p>
			</div>
		</div>
	);
};

export default MessageBanner;
