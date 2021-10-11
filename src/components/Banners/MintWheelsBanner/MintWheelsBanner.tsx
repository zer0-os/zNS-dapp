//- React Imports
import React from 'react';

//- Style Imports
import styles from './MintWheelsBanner.module.scss';
import arrow from './assets/bidarrow.svg';

type MintWheelsBannerProps = {
	title: string;
	label: React.ReactNode;
	buttonText: string;
	onClick: () => void;
	style?: React.CSSProperties;
};

const MintWheelsBanner: React.FC<MintWheelsBannerProps> = ({
	title,
	label,
	buttonText,
	onClick,
	style,
}) => {
	return (
		<button
			className={`${styles.Container} border-primary`}
			style={style}
			onClick={onClick}
		>
			<div className={`${styles.Background}`}></div>
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

export default MintWheelsBanner;
