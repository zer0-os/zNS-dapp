/* 
 Unified wizard component for creating different transaction flows
 */

import React, { useEffect, useState } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import { useBuyNowPrice, useZauctionApproval } from 'lib/hooks/znsSdk-hooks';
import { Bid, Domain, Metadata } from 'lib/types';
import { getMetadata } from 'lib/metadata';

import { FutureButton, Member, NFTMedia, Spinner } from 'components';

//- Style Imports
import styles from './TransactionWizard.module.scss';
import { useBidProvider } from 'lib/hooks/useBidProvider';
import useCurrency from 'lib/hooks/useCurrency';
import { ContractTransaction } from 'ethers';

interface TransactionWizardProps {
	domain: Domain;
	name: string;
	steps: TransactionData[];
	rejectMessage: string;
	cancelHandler: () => void;
	successHandler: () => void;
}

type TransactionData = {
	stepName: string;
	stepTemplate?: 'NFTPreview' | 'approval';
	stepAdditionalData: () => JSX.Element;
	actions: {
		cancel: () => Promise<ContractTransaction | undefined>;
		next: () => Promise<any>;
	};
	loadingMessage?: string;
};

export const TransactionWizard: React.FC<TransactionWizardProps> = ({
	domain,
	name,
	steps,
	successHandler,
	rejectMessage,
	cancelHandler,
}) => {
	///////////
	// State //
	///////////

	const { getBidsForDomain } = useBidProvider();

	const { wildPriceUsd } = useCurrency();

	const [currentStep, setCurrentStep] = useState(0);
	const [domainMetadata, setDomainMetadata] = useState<Metadata | undefined>();

	const [isTransactionFailed, setTransactionFailed] = useState(false);

	const [isRejectModalOpenned, setRejectModalOpenned] = useState(false);

	const [currentHighestBid, setCurrentHighestBid] = useState<Bid | undefined>();

	const [isWaletLoading, setWalletLoading] = useState(false);
	const [isTransactionProccessing, setTransactionProccessing] = useState(false);

	//- Web3 Wallet Data
	const walletContext = useWeb3React<Web3Provider>();
	const { account, library } = walletContext;

	const [zauctionApproved, isApprovalLoading] = useZauctionApproval({
		library,
		domainId: domain.id,
		account,
	});

	const [currentBuyPrice] = useBuyNowPrice({
		library,
		account,
		domainId: domain.id,
	});

	//////////////
	// Handlers //
	//////////////

	const handleCancel = () => {
		steps[currentStep].actions
			.cancel()
			.then(() => {
				setRejectModalOpenned(true);
			})
			.catch(() => {
				setTransactionFailed(true);
			});
	};

	const handleNextStep = async () => {
		setWalletLoading(true);

		steps[currentStep].actions
			.next()
			.then(async (transaction) => {
				if (typeof transaction !== 'undefined') {
					setWalletLoading(false);
					setTransactionProccessing(true);
					await transaction
						.wait()
						.then(() => {
							setCurrentStep(currentStep + 1);
						})
						.catch((error: any) => {
							console.error('network error, unable to set buy price');
							console.error(error);
						})
						.finally(() => {
							setTransactionProccessing(false);
						});
				} else {
					setCurrentStep(currentStep + 1);
					setWalletLoading(false);
				}
			})
			.catch((error) => {
				console.warn(error);
				setTransactionFailed(true);
				setWalletLoading(false);
			});
	};

	const handleTransactionSuccess = () => {
		successHandler();
	};

	const handleTransactionCancel = () => {
		cancelHandler();
	};

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		console.log(zauctionApproved);
		if (zauctionApproved && !isApprovalLoading) {
			setCurrentStep((prevStep) => prevStep + 1);
		}
	}, [zauctionApproved, isApprovalLoading]);

	useEffect(() => {
		let isSubscribed = true;

		const getCurrentHighestBid = async () => {
			// Get highest bid
			const allBids = await getBidsForDomain(domain);

			if (!allBids || allBids.length === 0) {
				return;
			}
			const highestBid = allBids.reduce(function (prev, current) {
				return prev.amount > current.amount ? prev : current;
			});

			if (isSubscribed) {
				setCurrentHighestBid(highestBid);
			}
		};

		getCurrentHighestBid();

		return () => {
			isSubscribed = false;
		};
	}, [domain, getBidsForDomain]);

	useEffect(() => {
		let isSubscribed = true;

		const loadDomainData = async () => {
			const metadata = await getMetadata(domain.metadata);
			if (!metadata) return;

			if (isSubscribed) {
				setDomainMetadata(metadata);
			}
		};

		loadDomainData();

		return () => {
			isSubscribed = false;
		};
	}, [domain]);

	/////////////////////
	// React Fragments //
	/////////////////////

	// todo implement tabs
	const tabs = () => (
		<div>
			<div></div>
		</div>
	);

	const pricePreview = (name: string, tokensAmount: number) => (
		<div className={styles.Price}>
			<h3>{name}</h3>
			<div className={styles.Value}>
				{tokensAmount > 0 && (
					<>
						<h4>
							{Intl.NumberFormat('en-US', {
								minimumFractionDigits: 2,
							}).format(tokensAmount)}
							{' WILD'}
						</h4>
						<span>
							{Intl.NumberFormat('en-US', {
								style: 'currency',
								currency: 'USD',
								minimumFractionDigits: 2,
							}).format(tokensAmount * wildPriceUsd)}
						</span>
					</>
				)}
			</div>
		</div>
	);

	const nftPreview = () => (
		<>
			<div>
				<NFTMedia
					alt="Bid NFT preview"
					style={{ objectFit: 'contain', zIndex: 2 }}
					ipfsUrl={
						domainMetadata?.animation_url ||
						domainMetadata?.image_full ||
						domainMetadata?.image ||
						''
					}
					size="small"
				/>
			</div>
			<div className={styles.Details}>
				<div>
					<h2>{domainMetadata?.title}</h2>
					<span className={styles.Domain}>0://{domain.name}</span>
				</div>
				<Member
					id={domain?.minter?.id || ''}
					name={''}
					image={''}
					subtext={'Creator'}
				/>
				{currentHighestBid
					? pricePreview('Highest Bid', currentHighestBid.amount)
					: ''}
				{Number(currentBuyPrice) > 0
					? pricePreview('Buy Now', Number(currentBuyPrice))
					: ''}
			</div>
		</>
	);

	const rejectTransaction = () => <div>{rejectMessage}</div>;

	const actionButtons = () => (
		<>
			<FutureButton onClick={handleCancel} className="Alt" glow={true}>
				Cancel
			</FutureButton>
			<FutureButton onClick={handleNextStep} glow={true}>
				Continue
			</FutureButton>
		</>
	);

	const finishButtons = () => (
		<>
			<FutureButton onClick={handleTransactionSuccess} glow={true}>
				Finish
			</FutureButton>
		</>
	);

	const rejectButtons = () => (
		<>
			<FutureButton
				onClick={() => setRejectModalOpenned(false)}
				className="Alt"
				glow={true}
			>
				Return
			</FutureButton>
			<FutureButton onClick={handleTransactionCancel} glow={true}>
				Close
			</FutureButton>
		</>
	);

	return (
		<div className={`${styles['wizard']} border-primary border-rounded blur`}>
			<div className={styles['wizard--header']}>
				<h1 className={`glow-text-white`}>
					{isRejectModalOpenned ? 'Are You Sure?' : name}
				</h1>
				{tabs()}
			</div>
			<div className={styles['wizard--body']}>
				{isRejectModalOpenned
					? ''
					: steps[currentStep].stepTemplate === 'NFTPreview'
					? nftPreview()
					: ''}
			</div>
			<div className={styles['wizard--additional']}>
				{isTransactionProccessing ? (
					<p>
						{steps[currentStep].loadingMessage} This may take up to 20 mins...
						Please do not close this window or refresh the page.
					</p>
				) : !isRejectModalOpenned ? (
					(isApprovalLoading && !zauctionApproved) || isWaletLoading ? (
						<p>Checking status of zAuction Approval...</p>
					) : (
						steps[currentStep].stepAdditionalData()
					)
				) : (
					rejectTransaction()
				)}
			</div>
			{isRejectModalOpenned ? (
				''
			) : isTransactionFailed ? (
				<div className={styles['wizard--error']}>
					<p>Approval rejected by wallet</p>
				</div>
			) : (
				''
			)}
			<div className={styles['wizard--action']}>
				{!isRejectModalOpenned ? (
					isApprovalLoading || isWaletLoading || isTransactionProccessing ? (
						<Spinner />
					) : currentStep === steps.length - 1 ? (
						finishButtons()
					) : (
						actionButtons()
					)
				) : (
					rejectButtons()
				)}
			</div>
		</div>
	);
};
