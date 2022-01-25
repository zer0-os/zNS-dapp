//- React Imports
import React, { useEffect, useState } from 'react';

//- Style Imports
import styles from './Banner.module.scss';
import arrow from './assets/bidarrow.svg';

//- Constant Imports
import { MOBILE_ALERT_TEXT } from './constants';

//- Utils Imports
import { BannerData } from './utils';

type BannerProps = {
	data: BannerData;
	onClick: (event: any) => void;
	style?: React.CSSProperties;
};

const Banner: React.FC<BannerProps> = ({ data, onClick, style }) => {
	const [backgroundBlob, setBackgroundBlob] = useState<string | undefined>();

	useEffect(() => {
		let isMounted = true;

		fetch(data.bannerImageUrl)
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
	}, []);

	return (
		<button
			className={`${styles.Container} border-primary`}
			style={style}
			onClick={onClick}
		>
			{backgroundBlob && (
				<img
					className={styles.Background}
					src={backgroundBlob}
					alt={data.bannerImageAlt}
				/>
			)}
			<div className={`${styles.Content}`}>
				<div className={`${styles.TextContainer}`}>
					<h2 className={`${styles.Title}`}>{data.title}</h2>
					<p className={`${styles.Label}`}>{data.label}</p>
					<p className={`${styles.Label} ${styles.Mobile}`}>
						{MOBILE_ALERT_TEXT}
					</p>
				</div>

				<p className={`${styles.Button}`}>
					{data.buttonText}
					<img alt="arrow" src={arrow} />
				</p>
			</div>
		</button>
	);
};

export default Banner;
