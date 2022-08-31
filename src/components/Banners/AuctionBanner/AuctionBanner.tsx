//- React Imports
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

//- Component Imports
import { Countdown } from 'components';

//- Utils Imports
import { AuctionBannerType } from './AuctionBanner.utils';

//- Constants Imports
import { ALT_TEXT } from './AuctionBanner.constants';

//- Assets Imports
import arrow from './assets/bidarrow.svg';

//- Style Imports
import styles from './AuctionBanner.module.scss';

type AuctionBannerProps = {
	data: AuctionBannerType;
	currentTime: number;
	isCountdown: boolean;
	onCountdownFinish: () => void;
};

const AuctionBanner: React.FC<AuctionBannerProps> = ({
	data,
	currentTime,
	isCountdown,
	onCountdownFinish,
}) => {
	const history = useHistory();
	const [backgroundBlob, setBackgroundBlob] = useState<string | undefined>();

	// set background image

	// could be a hook to cutdown
	useEffect(() => {
		if (!data?.imgUrl) {
			return;
		}

		let isMounted = true;

		fetch(data?.imgUrl)
			.then((r) => r.blob())
			.then((blob) => {
				if (isMounted) {
					const url = URL.createObjectURL(blob);
					setBackgroundBlob(url);
				}
			});
		return () => {
			isMounted = false;
		};
	}, [data?.imgUrl]);

	const onBannerClick = () => data && history.push(data.link.url);

	// - add logic to determine which stage of the data i.e. is current time >= countdown.duration ....

	return (
		<button className={styles.Container} onClick={onBannerClick}>
			{backgroundBlob && (
				<img
					className={styles.Background}
					src={backgroundBlob}
					alt={ALT_TEXT.BANNER}
				/>
			)}

			<div className={styles.Content}>
				<div className={styles.TextContainer}>
					<h2 className={styles.Title}>{data?.countdown.primaryText}</h2>

					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<p className={styles.Label}>
							{data?.countdown.secondaryText}{' '}
							{data && isCountdown && (
								<b>
									<Countdown
										to={data?.auctionClosed.duration}
										onFinish={onCountdownFinish}
									/>
								</b>
							)}
						</p>
					</div>
				</div>

				<p className={styles.Button}>
					{data?.link.text}
					<img alt={ALT_TEXT.ARROW} src={arrow} />
				</p>
			</div>
		</button>
	);
};

export default AuctionBanner;
