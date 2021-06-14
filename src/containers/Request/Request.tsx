//- React Imports
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

//- Component Imports
import { FutureButton, Image, Member, Overlay } from 'components';

//- Library Imports
import useMvpVersion from 'lib/hooks/useMvpVersion';
import { randomName, randomImage } from 'lib/Random';
import { ethers } from 'ethers';
import { tokenToUsd } from 'lib/coingecko';

//- Style Imports
import styles from './Request.module.css';

//- Type Imports
import { DisplayDomainRequest } from 'lib/types';

//- Asset Imports
import galaxyBackground from './assets/galaxy.png';

type RequestProps = {
	request: DisplayDomainRequest;
	yours?: boolean;
};

const Request: React.FC<RequestProps> = ({ request, yours }) => {
	const { mvpVersion } = useMvpVersion();
	const [stake, setStake] = useState(0);
	const [isLightboxOpen, setIsLightboxOpen] = useState(false);

	const tokenAmount = Number(ethers.utils.formatEther(request.stakeAmount));

	tokenToUsd('wilder-world').then((d) => {
		setStake(d as number);
	});

	const accept = () => {
		console.log('accept');
	};

	const deny = () => {
		console.log('deny');
	};

	const preview = () => setIsLightboxOpen(true);

	return (
		<div
			style={{ backgroundImage: `url(${galaxyBackground})` }}
			className={`${styles.Request} border-primary border-rounded`}
		>
			{isLightboxOpen && (
				<Overlay
					centered
					open={isLightboxOpen}
					onClose={() => setIsLightboxOpen(false)}
				>
					<Image
						src={request.image}
						style={{
							width: 'auto',
							maxHeight: '80vh',
							maxWidth: '80vw',
							objectFit: 'contain',
						}}
					/>
				</Overlay>
			)}
			<div className={styles.Image}>
				<Image src={request.image} onClick={preview} />
			</div>
			<div className={styles.Info}>
				<div>
					<h1 className="glow-text-white">{request.title}</h1>
					<span>0://{request.domainName}</span>
					<Member
						style={{ marginTop: 16 }}
						id={request.requestor}
						name={randomName(request.requestor)}
						image={randomImage(request.requestor)}
						showZna={mvpVersion === 3}
						subtext={'Creator'}
					/>
				</div>
				<div>
					<span
						style={{
							fontWeight: 700,
							color: 'var(--color-primary-lighter-3)',
							textTransform: 'uppercase',
						}}
						className={'glow-text-blue'}
					>
						Stake Offer
					</span>
					<div className={styles.Offer} style={{ opacity: stake ? 1 : 0 }}>
						<span>
							{tokenAmount.toLocaleString()} {request.stakeCurrency}
						</span>
						<span>
							${Number((tokenAmount * stake).toFixed(2)).toLocaleString()} USD
						</span>
					</div>
					{!yours && (
						<div className={styles.Buttons}>
							<FutureButton
								style={{ textTransform: 'uppercase' }}
								alt
								glow
								onClick={deny}
							>
								Deny
							</FutureButton>
							<FutureButton
								style={{ textTransform: 'uppercase' }}
								glow
								onClick={accept}
							>
								Accept
							</FutureButton>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Request;
