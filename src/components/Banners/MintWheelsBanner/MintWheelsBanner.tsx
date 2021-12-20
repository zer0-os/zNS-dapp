//- React Imports
import React, { useEffect, useState } from 'react';

//- Style Imports
import styles from './MintWheelsBanner.module.scss';
import arrow from './assets/bidarrow.svg';
import banner from './assets/cribs-banner.gif';

type MintWheelsBannerProps = {
	title: string;
	label: React.ReactNode;
	buttonText: string;
	onClick: (event: any) => void;
	style?: React.CSSProperties;
};

const MintWheelsBanner: React.FC<MintWheelsBannerProps> = ({
	title,
	label,
	buttonText,
	onClick,
	style,
}) => {
	const [backgroundBlob, setBackgroundBlob] = useState<string | undefined>();

	useEffect(() => {
		let isMounted = true;

		fetch(banner)
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
				<img className={styles.Background} src={backgroundBlob} alt="" />
			)}
			<div className={`${styles.Content}`}>
				<div className={`${styles.TextContainer}`}>
					<h2 className={`${styles.Title}`}>{title}</h2>
					<p className={`${styles.Label}`}>{label}</p>
					<p className={`${styles.Label} ${styles.Mobile}`}>
						Minting is available on desktop only
					</p>
				</div>

				<p className={`${styles.Button}`}>
					{buttonText}
					<img alt="arrow" src={arrow} />
				</p>
			</div>
		</button>
	);
};

export default MintWheelsBanner;
