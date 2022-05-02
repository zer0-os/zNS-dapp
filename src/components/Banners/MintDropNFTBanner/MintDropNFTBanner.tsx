//- React Imports
import React, { useEffect, useState } from 'react';

//- Style Imports
import styles from './MintDropNFTBanner.module.scss';
import arrow from './assets/bidarrow.svg';
import banner from './assets/kicks-s2-banner.gif';

type MintDropNFTBannerProps = {
	title: string;
	label: React.ReactNode;
	buttonText: string;
	onClick: (event: any) => void;
	style?: React.CSSProperties;
};

const MintDropNFTBanner: React.FC<MintDropNFTBannerProps> = ({
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
				</div>

				<p className={`${styles.Button}`}>
					{buttonText}
					<img alt="arrow" src={arrow} />
				</p>
			</div>
		</button>
	);
};

export default MintDropNFTBanner;
