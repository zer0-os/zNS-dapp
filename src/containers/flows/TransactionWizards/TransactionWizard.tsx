/* 
 Unified wizard component for creating different transaction flows
 */

import React, { useEffect, useState } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import { useZauctionApproval } from 'lib/hooks/znsSdk-hooks';
import { Bid, Domain, Metadata } from 'lib/types';
import { getMetadata } from 'lib/metadata';

import { FutureButton, Member, NFTMedia, Spinner } from 'components';

//- Style Imports
import styles from './TransactionWizard.module.scss';
import { useBidProvider } from 'lib/hooks/useBidProvider';
import useCurrency from 'lib/hooks/useCurrency';
import { ethers } from 'ethers';

interface TransactionWizardProps {
	domain: Domain;
	name: string;
	steps: TransactionData[];
	cancelHandler: () => void;
	successHandler: () => void;
}

type TransactionData = {
	stepName: string;
	stepTemplate?: 'NFTPreview' | 'approval';
	stepAdditionalData: () => JSX.Element;
	actions: { cancel: () => Promise<void>; next: () => Promise<void> };
};

export const TransactionWizard: React.FC<TransactionWizardProps> = ({
	domain,
	name,
	steps,
	successHandler,
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

	const [currentHighestBid, setCurrentHighestBid] = useState<Bid | undefined>();
	const [currentBuyPrice, setCurrentBuyPrice] = useState<
		BigInteger | undefined
	>();

	//- Web3 Wallet Data
	const walletContext = useWeb3React<Web3Provider>();
	const { account, library } = walletContext;

	const [zauctionApproved, isApprovalLoading] = useZauctionApproval({
		library,
		domainId: domain.id,
		account,
	});

	//////////////
	// Handlers //
	//////////////

	const handleCancel = () => {
		steps[currentStep].actions
			.cancel()
			.then(() => {
				setCurrentStep(currentStep + 1);
			})
			.catch(() => {
				setTransactionFailed(true);
			});
	};

	const handleNextStep = async () => {
		steps[currentStep].actions
			.next()
			.then(() => {
				setCurrentStep(currentStep + 1);
			})
			.catch(() => {
				setTransactionFailed(true);
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
		if (zauctionApproved && steps[currentStep].stepTemplate === 'approval') {
			setCurrentStep(currentStep + 1);
		}
		console.log(zauctionApproved);
	}, [zauctionApproved]);

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
	}, [domain]);

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

	const tab = (active: boolean) => <></>;

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
				{currentBuyPrice
					? pricePreview(
							'Buy Now',
							Number(ethers.utils.formatEther(currentBuyPrice)),
					  )
					: ''}
			</div>
		</>
	);

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

	return (
		<div className={`${styles['wizard']} border-primary border-rounded blur`}>
			<div className={styles['wizard--header']}>
				<h1 className={`glow-text-white`}>{name}</h1>
				{tabs()}
			</div>
			<div className={styles['wizard--body']}>
				{steps[currentStep].stepTemplate === 'NFTPreview' ? nftPreview() : ''}
			</div>
			<div className={styles['wizard--additional']}>
				{isApprovalLoading && !zauctionApproved ? (
					<p>Checking status of zAuction Approval...</p>
				) : (
					steps[currentStep].stepAdditionalData()
				)}
			</div>
			{isTransactionFailed ? (
				<div className={styles['wizard--error']}>
					<p>Approval rejected by wallet</p>
				</div>
			) : (
				''
			)}
			<div className={styles['wizard--action']}>
				{isApprovalLoading ? (
					<Spinner />
				) : currentStep === steps.length - 1 ? (
					finishButtons()
				) : (
					actionButtons()
				)}
			</div>
		</div>
	);
};
