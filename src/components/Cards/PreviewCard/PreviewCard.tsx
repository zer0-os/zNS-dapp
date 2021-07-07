//- React imports
import React from 'react';

//- Style Imports
import styles from './PreviewCard.module.css';

//- Library Imports
import { randomName, randomImage } from 'lib/Random';

//- Component Imports
import { FutureButton, Image, Member } from 'components';

type PreviewCardProps = {
	image: string;
	style?: React.CSSProperties;
	name: string;
	domain: string;
	description: string;
	creatorId: string;
	ownerId: string;
	isLoading: boolean;
	children?: React.ReactNode;
	mvpVersion: number;
	onButtonClick: () => void;
	onImageClick?: () => void;
};

const PreviewCard: React.FC<PreviewCardProps> = ({
	image,
	style,
	name,
	domain,
	description,
	creatorId,
	ownerId,
	isLoading,
	children,
	mvpVersion,
	onButtonClick,
	onImageClick,
}) => {
	// TODO: Work out how the data for the asset cards should be passed in
	// Would it actually make more sense to have the bottom row of the preview card be whatever
	// is passed in as a child?

	const open = () => {
		if (onImageClick) onImageClick();
	};

	return (
		<div
			className={`${styles.PreviewCard} border-primary border-rounded blur`}
			style={style ? style : {}}
		>
			{isLoading && (
				<div className={styles.Loading}>
					<div className={styles.Spinner}></div>
				</div>
			)}
			<>
				<div className={styles.Preview} style={{ opacity: isLoading ? 0 : 1 }}>
					<div
						className={`${styles.Asset} ${
							mvpVersion === 3 ? styles.MVP3Asset : ''
						}`}
					>
						<Image onClick={open} src={image} />
					</div>
					<div className={styles.Body}>
						<div>
							<h5>{name ? name : domain.split('/')[1]}</h5>
							<span className={styles.Domain}>
								0://wilder.{domain.substring(1)}
							</span>
							<p>{description}</p>
						</div>
						<div className={styles.Members}>
							{/* TODO: Switch these to Member component */}
							<Member
								id={creatorId}
								name={randomName(creatorId)}
								image={randomImage(creatorId)}
								subtext={'Creator'}
							/>
							<Member
								id={ownerId}
								name={randomName(ownerId)}
								image={randomImage(ownerId)}
								subtext={'Owner'}
							/>
						</div>
					</div>
					<div
						className={styles.Buy}
						style={{ alignItems: mvpVersion === 3 ? 'center' : 'flex-end' }}
					>
						{mvpVersion === 1 && (
							<FutureButton
								glow
								onClick={onButtonClick}
								style={{ height: 36, width: 160, borderRadius: 30 }}
							>
								MAKE A BID
							</FutureButton>
						)}
						{mvpVersion === 3 && (
							<div>
								<FutureButton
									glow
									onClick={onButtonClick}
									style={{ height: 36, width: 118, borderRadius: 30 }}
								>
									BUY
								</FutureButton>
								<span className={`glow-text-white`}>
									W1.56 <span className={`glow-text-blue`}>($8,000)</span>
								</span>
								<span className={`glow-text-blue`}>Last Offer</span>
							</div>
						)}
					</div>
				</div>
				{children && mvpVersion === 3 && (
					<>
						<hr className="glow" style={{ opacity: isLoading ? 0 : 1 }} />
						<div
							className={styles.Children}
							style={{ opacity: isLoading ? 0 : 1 }}
						>
							{children}
						</div>
					</>
				)}
			</>
		</div>
	);
};

export default PreviewCard;
