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
import { useStakingController } from 'lib/hooks/useStakingController';

//- Style Imports
import styles from './Request.module.css';

//- Type Imports
import { DisplayDomainRequest } from 'lib/types';

//- Asset Imports
import galaxyBackground from './assets/galaxy.png';

type RequestProps = {
	request: DisplayDomainRequest;
	yours?: boolean;
	onAccept: () => void;
};

const Request: React.FC<RequestProps> = ({ request, yours, onAccept }) => {
	////////////////////
	// Imported Hooks //
	////////////////////

	const { approveRequest } = useStakingController();
	const { mvpVersion } = useMvpVersion();

	///////////
	// State //
	///////////

	const [stake, setStake] = useState(0);
	const [isLightboxOpen, setIsLightboxOpen] = useState(false);
	const [hasAccepted, setHasAccepted] = useState(false);

	const tokenAmount = Number(ethers.utils.formatEther(request.stakeAmount));

	tokenToUsd('wilder-world').then((d) => {
		setStake(d as number);
	});

	const accept = () => setHasAccepted(true);

	const deny = () => {
		console.log('deny');
	};

	const confirm = () => {
		if (onAccept) onAccept();
	};
	const cancel = () => setHasAccepted(false);

	const preview = () => setIsLightboxOpen(true);

	return (
		<div
			style={{ backgroundImage: `url(${galaxyBackground})` }}
			className={`${styles.Request} border-primary border-rounded`}
		>
			{isLightboxOpen && (
				<Overlay
					centered
					img
					open={isLightboxOpen}
					onClose={() => setIsLightboxOpen(false)}
				>
					<div>
						<Image
							src={request.image}
							style={{
								width: 'auto',
								maxHeight: '80vh',
								maxWidth: '80vw',
								objectFit: 'contain',
								textAlign: 'center',
							}}
						/>
					</div>
				</Overlay>
			)}
			{hasAccepted && (
				<Overlay centered open onClose={() => setHasAccepted(false)}>
					<div
						className={`${styles.Confirmation} blur border-primary border-rounded`}
					>
						<h2 className="glow-text-white">Are you sure?</h2>
						<hr className="glow" />
						<p>
							This NFT is about to be seared upon the Blockchain. There’s no
							going back.
						</p>
						<div className={styles.Buttons}>
							<FutureButton
								style={{ textTransform: 'uppercase' }}
								alt
								glow
								onClick={cancel}
							>
								Cancel
							</FutureButton>
							<FutureButton
								style={{ textTransform: 'uppercase' }}
								glow
								onClick={confirm}
							>
								Confirm
							</FutureButton>
						</div>
					</div>
				</Overlay>
			)}

			<div className={styles.Image}>
				<Image src={request.image} onClick={preview} />
			</div>
			<div className={styles.Info}>
				<div>
					<h1 className="glow-text-white">{request.title}</h1>
					<span className={styles.Domain}>0://{request.domainName}</span>
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
					<div className={styles.Offer}>
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
