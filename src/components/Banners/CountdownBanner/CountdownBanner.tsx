import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import styles from './CountdownBanner.module.css';

import arrow from './assets/bidarrow.svg';

type TimeRemaining = {
	seconds: number;
	minutes: number;
	hours: number;
	days: number;
};

const CountdownBanner = () => {
	const history = useHistory();

	const onClick = () => {
		history.push('kicks.airwild.season0');
	};

	const endDate = new Date(Date.UTC(2021, 8, 17, 1)).getTime();

	const [isFinished, setIsFinished] = useState(false);

	const calculateTimeLeft = () => {
		const now = new Date().getTime();
		const difference = endDate - now;
		const seconds = Math.floor((difference / 1000) % 60);
		const minutes = Math.floor((difference / 1000 / 60) % 60);
		const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
		const days = hours > 24 ? hours % 24 : 0;

		if (difference <= 0) {
			setIsFinished(true);
			return;
		}

		return `${days > 0 ? days + 'd ' : ''}${hours > 0 ? hours + 'h ' : ''}${
			minutes > 0 ? minutes + 'm ' : ''
		}${seconds}s`;
	};

	const [timeLeft, setTimeLeft] = useState<string | undefined>();

	useEffect(() => {
		let isActive = true;
		setTimeout(() => {
			if (isActive && !isFinished) {
				setTimeLeft(calculateTimeLeft());
			}
		}, 1000);
		return () => {
			isActive = false;
		};
	}, [timeLeft]);

	return (
		<div onClick={onClick} className={`${styles.nextDrop} border-rounded`}>
			{!isFinished && (
				<span>
					AIR WILD auction ending in{' '}
					<b className={styles.Remaining}>{timeLeft}</b>
					<b className={styles.Bid}>
						Bid Now
						<img alt="arrow" className={styles.Arrow} src={arrow} />
					</b>
				</span>
			)}
			{isFinished && <span>AIRWILD auction has closed</span>}
			<div className={styles.Background}></div>
		</div>
	);
};

export default CountdownBanner;
