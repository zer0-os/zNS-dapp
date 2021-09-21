//- React Imports
import React, { useState } from 'react';

//- Component Imports
import {
	FutureButton,
	Image,
	LoadingIndicator,
	Member,
	NFTMedia,
	Overlay,
	Spinner,
} from 'components';

//- Library Imports
import { randomName, randomImage } from 'lib/Random';
import { ethers } from 'ethers';
import { tokenToUsd } from 'lib/tokenPrices';
import { getMetadata } from 'lib/metadata';

//- Style Imports
import styles from './Request.module.css';

//- Type Imports
import { DomainRequestAndContents, Maybe, Metadata } from 'lib/types';

//- Asset Imports
import galaxyBackground from './assets/galaxy.png';
import { useCurrencyProvider } from 'lib/providers/CurrencyProvider';

type RequestProps = {
	request: DomainRequestAndContents;
	// @TODO Change 'yours' to 'sentByYou'
	showLoadingIndicator: boolean;
	yours?: boolean;
	onApprove: (request: DomainRequestAndContents) => void;
	onFulfill: (request: DomainRequestAndContents) => void;
	onNavigate: (domain: string) => void;
	errorText?: string;
};

const Request: React.FC<RequestProps> = ({
	request,
	showLoadingIndicator,
	yours,
	onApprove,
	onFulfill,
	onNavigate,
	errorText,
}) => {
	////////////////////
	// Imported Hooks //
	////////////////////

	const currency = useCurrencyProvider();

	///////////
	// State //
	///////////

	const [isLightboxOpen, setIsLightboxOpen] = useState(false); // Toggle image lightbox
	const [isModalOpen, setIsModalOpen] = useState(false); // Toggle confirmation overlay
	const [errorMessage, setErrorMessage] =
		useState<Maybe<React.ReactFragment>>(); // Toggle confirmation overlay
	const isFulfilling =
		yours && request.request.approved && !request.request.fulfilled;
	const [metadata, setMetadata] = useState<Metadata | undefined>();

	// Token offer in correct format
	const tokenAmount = Number(
		ethers.utils.formatEther(request.request.offeredAmount),
	);

	///////////////
	// Functions //
	///////////////

	const openModal = () => {
		setIsModalOpen(true);
		setErrorMessage(undefined);
	};
	const closeModal = () => setIsModalOpen(false);
	const preview = () => setIsLightboxOpen(true);
	const confirm = () => {
		if (isFulfilling && onFulfill) onFulfill(request);
		else if (!isFulfilling && onApprove) onApprove(request);
	};
	const navigate = () => {
		if (onNavigate) onNavigate(request.request.domain);
	};

	/////////////
	// Effects //
	/////////////

	React.useEffect(() => {
		getMetadata(request.contents.metadata).then((d) => {
			if (!d) return;
			setMetadata(d);
		});
	}, [request]);

	const stakeCurrencyToUsd = currency.lootPriceUsd;

	//And after a new error, show error message
	React.useEffect(() => {
		if (errorText && errorText.length > 0) {
			setErrorMessage(
				<p style={{ marginTop: '16px' }} className={styles.Error}>
					{`${errorText} Try again later.`}
				</p>,
			);
		}
	}, [errorText]);

	return (
		<div
			style={{ backgroundImage: `url(${galaxyBackground})` }}
			className={`${styles.Request} border-primary border-rounded`}
		>
			{/* Image Lightbox */}
			{isLightboxOpen && (
				<Overlay
					centered
					img
					open={isLightboxOpen}
					onClose={() => setIsLightboxOpen(false)}
				>
					<div>
						<Image
							controls
							src={metadata?.image || ''}
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

			{/* Confirmation Overlay */}
			{isModalOpen && (
				<Overlay centered open onClose={closeModal}>
					<div
						className={`${styles.Confirmation} blur border-primary border-rounded`}
					>
						<h2 className="glow-text-white">Are you sure?</h2>
						<hr className="glow" />
						<p>
							{yours
								? 'This NFT is about to be seared upon the Blockchain.'
								: `This will approve the request for another user to mint 0://${request.request.domain}`}
						</p>
						<p>There's no going back.</p>
						{!showLoadingIndicator && (
							<div className={styles.Buttons}>
								<FutureButton
									style={{ textTransform: 'uppercase' }}
									alt
									glow
									onClick={closeModal}
								>
									Cancel
								</FutureButton>
								<FutureButton
									style={{ textTransform: 'uppercase' }}
									glow
									onClick={confirm}
								>
									Continue
								</FutureButton>
							</div>
						)}
						{!showLoadingIndicator && errorText && errorMessage && (
							<div>{errorMessage}</div>
						)}
						<div className={styles.FulfillIndicator}>
							{showLoadingIndicator && (
								<LoadingIndicator
									text={'Please confirm transaction in wallet'}
								/>
							)}
						</div>
					</div>
				</Overlay>
			)}

			{/* Preview Image (Clickable) */}
			<div className={styles.Image}>
				<NFTMedia
					style={{
						borderRadius: 10,
						borderWidth: 2,
						objectFit: 'contain',
					}}
					size="medium"
					alt="NFT Preview"
					ipfsUrl={metadata?.image ?? ''}
				/>
			</div>

			{/* Requested Domain Info (Name, description, etc.) */}
			<div className={styles.Info}>
				<div>
					<h1 className="glow-text-white">{metadata?.title || ''}</h1>
					<span className={styles.Domain}>0://{request.request.domain}</span>
					<Member
						style={{ marginTop: 32 }}
						id={request.request.requestor.id}
						name={randomName(request.request.requestor.id)}
						image={randomImage(request.request.requestor.id)}
						subtext={'Creator'}
					/>
					<div className={styles.Story}>{metadata?.description || ''}</div>
				</div>

				{/* Stake Info */}
				<div>
					<span
						style={{
							color: 'var(--color-primary-lighter-3)',
							textAlign: 'center',
							fontSize: 16,
						}}
						className={'glow-text-blue'}
					>
						Stake Offer
					</span>
					<div className={styles.Offer}>
						<span>
							{tokenAmount.toLocaleString()} {request.contents.stakeCurrency}
						</span>
						{stakeCurrencyToUsd > 0 && (
							<span>
								($
								{Number(
									(tokenAmount * stakeCurrencyToUsd).toFixed(2),
								).toLocaleString()}{' '}
								USD)
							</span>
						)}
					</div>

					{/* Action Buttons */}

					{/* Fulfill */}
					{yours && request.request.approved && !request.request.fulfilled && (
						<div className={styles.Buttons}>
							<FutureButton
								style={{ textTransform: 'uppercase' }}
								glow
								onClick={openModal}
							>
								Fulfill
							</FutureButton>
						</div>
					)}

					{yours && request.request.approved && request.request.fulfilled && (
						<div className={styles.Buttons}>
							<FutureButton
								style={{ textTransform: 'uppercase' }}
								glow
								onClick={navigate}
							>
								View in ZNS
							</FutureButton>
						</div>
					)}

					{/* Approve */}
					{!yours && !request.request.approved && (
						<div className={styles.Buttons}>
							<FutureButton
								style={{ textTransform: 'uppercase' }}
								glow
								onClick={openModal}
							>
								Approve
							</FutureButton>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Request;
