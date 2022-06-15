//- React Imports
import { useEffect, useState } from 'react';

//- Component Imports
import { MintDropNFTBanner, Overlay, ConnectToWallet } from 'components';

//- Types Imports
import { ClaimData } from './ClaimNFT.types';

//- Style Imports
import styles from './ClaimNFTContainer.module.scss';
import ClaimNFT from '../ClaimNFT/ClaimNFT';
import { getBannerButtonText, getBannerLabel } from './labels';
import useAsyncEffect from 'use-async-effect';
import { useZSaleSdk } from 'lib/hooks/sdk';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { getDropStage } from '../MintDropNFT/helpers';
import { Stage } from '../MintDropNFT/types';
import { IDWithClaimStatus } from '@zero-tech/zsale-sdk';
import { ethers } from 'ethers';
import { Maybe } from 'lib/types';
import useNotification from 'lib/hooks/useNotification';

export type ClaimNFTContainerProps = {
	requireBanner?: boolean;
	privateSaleEndTime: number;
};

const ClaimNFTContainer = ({
	requireBanner,
	privateSaleEndTime,
}: ClaimNFTContainerProps) => {
	//////////////////
	// State & Data //
	//////////////////
	const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
	const [isConnectPromptOpen, setIsConnectPromptOpen] =
		useState<boolean>(false);
	const [failedToLoad, setFailedToLoad] = useState<boolean>(false);
	const [hasCountdownFinished, setHasCountdownFinished] =
		useState<boolean>(false);
	const [dropStage, setDropStage] = useState<Stage | undefined>();
	const [wheelsTotal, setWheelsTotal] = useState<number | undefined>();
	const [wheelsMinted, setWheelsMinted] = useState<number | undefined>();
	const [countdownDate, setCountdownDate] = useState<number | undefined>();
	const [refetch, setRefetch] = useState<number>(0);
	const [canOpenWizard, setCanOpenWizard] = useState<boolean>(false);
	const [eligibleDomains, setEligibleDomains] = useState<IDWithClaimStatus[]>(
		[],
	);
	const PRIVATE_SALE_END_TIME = privateSaleEndTime;
	const { addNotification } = useNotification();

	const { claimInstance } = useZSaleSdk();
	const { account, library } = useWeb3React<Web3Provider>();

	useAsyncEffect(async () => {
		const saleData = await claimInstance.getSaleData();
		console.log(saleData);
	}, [claimInstance, library, account]);

	useAsyncEffect(async () => {
		const saleStatus = await claimInstance.getSaleStatus();
		console.log(saleStatus);
	}, [claimInstance, library, account]);
	///////////////
	// Functions //
	///////////////

	const openWizard = (event: any) => {
		setIsWizardOpen(true);
	};

	const closeWizard = () => {
		setIsWizardOpen(false);
	};

	const openConnect = () => {
		setIsConnectPromptOpen(true);
	};

	const closeConnect = () => {
		setIsConnectPromptOpen(false);
	};

	const countdownFinished = () => {
		setHasCountdownFinished(true);
	};

	const onSubmit = async (data: ClaimData) => {
		const { quantity, statusCallback, finishedCallback, errorCallback } = data;
		try {
			if (!library) {
				return;
			}
			let tx: Maybe<ethers.ContractTransaction>;

			const domainsForClaiming = eligibleDomains
				.splice(0, quantity)
				.map((i) => i.id);

			statusCallback('Please approve in your wallet');

			tx = await claimInstance.claimDomains(
				domainsForClaiming,
				library?.getSigner(),
			);
			statusCallback('Minting your moto');

			await tx.wait();
			addNotification('Claim Success');

			finishedCallback();
		} catch (err) {
			errorCallback('Failed Transaction');
			console.log(err);
		}
	};

	const handleResize = () => {
		setCanOpenWizard(window.innerWidth >= 320);
	};

	useEffect(() => {
		window.addEventListener('resize', handleResize);
		handleResize();
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	/**
	 * This is the initial "get data"
	 */
	useEffect(() => {
		let isMounted = true;

		// Generally this would be < DATE_WHITELIST & < PUBLIC_SALE_START_TIME
		// but given time constraints we're just going to compare
		// to PUBLIC_SALE_START_TIME

		const getData = async () => {
			if (!claimInstance) {
				return;
			}
			try {
				if (!isMounted) {
					return;
				}
				const saleData = await claimInstance.getSaleData();
				const currentDropStage = await getDropStage(claimInstance);
				if (currentDropStage === Stage.Upcoming) {
					setCountdownDate(undefined);
					setTimeout(() => {
						setRefetch(refetch + 1);
					}, 7000);
				} else if (currentDropStage === Stage.Whitelist) {
					setCountdownDate(PRIVATE_SALE_END_TIME);
				} else {
					setCountdownDate(undefined);
				}
				if (refetch > 0) {
					setCountdownDate(undefined);
				}
				setDropStage(currentDropStage);
				setWheelsTotal(saleData.amountForSale);
				setWheelsMinted(saleData.amountSold);
				setFailedToLoad(false);
			} catch (err) {
				console.error(err);
				console.log('failed to get');
				setRefetch(refetch + 1);
				setFailedToLoad(true);
			}
		};
		getData();
		return () => {
			isMounted = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [library, claimInstance]);

	/**
	 * Get user-specific variables whenever mint amount or account changes
	 */
	useAsyncEffect(async () => {
		let isMounted = true;

		if (!claimInstance || !library || !account) {
			return;
		}
		// Get user data if wallet connected
		if (account && library) {
			try {
				if (!isMounted) {
					return;
				}
				const claimingIDs = await claimInstance.getClaimingIDsForUser(account);
				// console.log('claimingIDs', claimingIDs);
				setEligibleDomains(claimingIDs.filter((i) => i.canBeClaimed));
			} catch (err) {
				console.log(err);
			}
		}
		return () => {
			isMounted = false;
		};
	}, [account, library, claimInstance]);

	/**
	 * Gets and sets what stage the sale is in
	 */
	useAsyncEffect(async () => {
		let isMounted = true;
		if (!claimInstance || !library) {
			return;
		}

		try {
			if (!isMounted) {
				return;
			}
			const saleData = await claimInstance.getSaleData();
			const currentDropStage = await getDropStage(claimInstance);
			if (dropStage !== undefined) {
				if (hasCountdownFinished && currentDropStage === dropStage) {
					setTimeout(() => {
						setRefetch(refetch + 1);
					}, 7000);
					return;
				}
				if (currentDropStage === Stage.Upcoming) {
					setCountdownDate(undefined);
					setTimeout(() => {
						setRefetch(refetch + 1);
					}, 7000);
				} else if (currentDropStage === Stage.Whitelist) {
					setCountdownDate(PRIVATE_SALE_END_TIME);
				} else {
					setCountdownDate(undefined);
				}
				if (refetch > 0) {
					setCountdownDate(undefined);
				}
				setDropStage(currentDropStage);
				setWheelsTotal(saleData.amountForSale);
				setWheelsMinted(saleData.amountSold);
			}
		} catch (err) {
			if (!failedToLoad) {
				setTimeout(() => {
					setRefetch(refetch + 1);
				}, 7000);
			}
			setFailedToLoad(true);
		}
		return () => {
			isMounted = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasCountdownFinished, refetch, library, claimInstance]);

	/**
	 * Listens for changes to drop stage, and handles UI accordingly
	 */
	useEffect(() => {
		let timer: any;
		if (
			claimInstance &&
			(dropStage === Stage.Public || dropStage === Stage.Whitelist) &&
			account &&
			library
		) {
			// Fetch minted count periodically
			timer = setInterval(async () => {
				const sold = await claimInstance.getNumberOfDomainsSold();
				if (sold) {
					if (wheelsTotal !== undefined && sold.toNumber() >= wheelsTotal) {
						setDropStage(Stage.Sold);
					}
					setWheelsMinted(sold.toNumber());
				}
			}, 5000);
		}

		return () => {
			timer && clearInterval(timer);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dropStage, claimInstance, account, library]);

	const bannerLabel = () => {
		return failedToLoad
			? 'Failed to load sale data - refresh to try again'
			: getBannerLabel(
					dropStage,
					wheelsMinted,
					wheelsTotal,
					countdownDate,
					countdownFinished,
					hasCountdownFinished,
			  );
	};

	const buttonText = () => {
		return failedToLoad || (dropStage === Stage.Whitelist && !countdownDate)
			? 'Learn More'
			: getBannerButtonText(dropStage, canOpenWizard);
	};

	////////////
	// Render //
	////////////

	return (
		<>
			{isConnectPromptOpen && (
				<Overlay open onClose={closeConnect}>
					<ConnectToWallet onConnect={closeConnect} />
				</Overlay>
			)}
			{isWizardOpen && (
				<Overlay open onClose={closeWizard}>
					<ClaimNFT
						openConnect={openConnect}
						onClose={closeWizard}
						onSubmit={onSubmit}
						eligibleDomains={eligibleDomains}
					/>
				</Overlay>
			)}
			{requireBanner ? (
				<div className={styles.BannerContainer}>
					<MintDropNFTBanner
						title={'Claim Your Moto Blessings'}
						label={bannerLabel()}
						buttonText={buttonText()}
						onClick={openWizard}
					/>
				</div>
			) : (
				<ClaimNFT
					openConnect={openConnect}
					onClose={closeWizard}
					onSubmit={onSubmit}
					eligibleDomains={eligibleDomains}
				/>
			)}
		</>
	);
};

export default ClaimNFTContainer;
