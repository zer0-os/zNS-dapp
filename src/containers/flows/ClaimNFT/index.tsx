//- React Imports
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

//- Component Imports
import { MintDropNFTBanner, Overlay, ConnectToWallet } from 'components';
import ClaimNFT from '../ClaimNFT/ClaimNFT';

//- Types Imports
import { ClaimData } from './ClaimNFT.types';
import { Stage } from '../MintDropNFT/types';

//- Constants Imports
import { getBannerButtonText, getBannerLabel } from './labels';
import { DOMAINS, MESSAGES } from './ClaimNFT.constants';
import { ROUTES } from 'constants/routes';

//- Utils Imports
import { getDropStage } from '../MintDropNFT/helpers';

//- Library Imports
import useAsyncEffect from 'use-async-effect';
import { useZSaleSdk } from 'lib/hooks/sdk';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { ClaimableDomain } from '@zero-tech/zsale-sdk';
import useMint from 'lib/hooks/useMint';

//- Style Imports
import styles from './ClaimNFTContainer.module.scss';

export type ClaimNFTContainerProps = {
	requireBanner?: boolean;
	privateSaleEndTime: number;
	onClose: () => void;
	setClaimDropStage: (status?: Stage) => void;
};

const ClaimNFTContainer = ({
	requireBanner,
	privateSaleEndTime,
	onClose,
	setClaimDropStage,
}: ClaimNFTContainerProps) => {
	//////////////////
	// State & Data //
	//////////////////
	const PRIVATE_SALE_END_TIME = privateSaleEndTime;
	const { push: goTo } = useHistory();
	const { claimNFT } = useMint();
	const { claimInstance } = useZSaleSdk();
	const { account, library } = useWeb3React<Web3Provider>();
	const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
	const [isConnectPromptOpen, setIsConnectPromptOpen] =
		useState<boolean>(false);
	const [failedToLoad, setFailedToLoad] = useState<boolean>(false);
	const [hasCountdownFinished, setHasCountdownFinished] =
		useState<boolean>(false);
	const [isClaimingInProgress, setIsClaimingInProgress] =
		useState<boolean>(false);
	const [dropStage, setDropStage] = useState<Stage | undefined>();
	const [assetTotal, setAssetTotal] = useState<number | undefined>();
	const [assetsMinted, setAssetsMinted] = useState<number | undefined>();
	const [countdownDate, setCountdownDate] = useState<number | undefined>();
	const [refetch, setRefetch] = useState<number>(0);
	const [canOpenWizard, setCanOpenWizard] = useState<boolean>(false);
	const [isClaimDataLoading, setIsClaimDataLoading] = useState<boolean>(false);
	const [eligibleDomains, setEligibleDomains] = useState<ClaimableDomain[]>([]);

	// NOTE: TEMPORARY FOR SALE HALT
	const isSaleHalted = false;

	///////////////
	// Functions //
	///////////////

	const openWizard = (event: any) => {
		if (event.target.nodeName.toLowerCase() === 'a') {
			return;
		}

		if (dropStage === Stage.Whitelist && !countdownDate) {
			window?.open(
				'https://zine.wilderworld.com/moto-genesis-nft-rewards/',
				'_blank',
			);
		}
		if (dropStage === Stage.Upcoming || !canOpenWizard || failedToLoad) {
			window?.open('https://discord.gg/mb9fcFey8a', '_blank')?.focus();
		} else if (dropStage === Stage.Sold || dropStage === Stage.Ended) {
			goTo(ROUTES.MARKET + DOMAINS.CURRENT_CLAIM_ROUTE);
		} else {
			setIsWizardOpen(true);
		}
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
		const {
			quantity,
			eligibleDomains,
			setEligibleDomains,
			setIsClaimingInProgress,
			statusCallback,
			errorCallback,
			finishedCallback,
		} = data;
		if (!isSaleHalted) {
			claimNFT(
				quantity,
				eligibleDomains,
				setEligibleDomains,
				setIsClaimingInProgress,
				statusCallback,
				errorCallback,
				finishedCallback,
			);
		} else {
			errorCallback(MESSAGES.SALE_ENDED);
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
	useAsyncEffect(
		async (isActive) => {
			// Generally this would be < DATE_WHITELIST & < PUBLIC_SALE_START_TIME
			// but given time constraints we're just going to compare
			// to PUBLIC_SALE_START_TIME

			if (!claimInstance) {
				return;
			}
			try {
				const saleData = await claimInstance.getSaleData();
				const currentDropStage = await getDropStage(claimInstance);
				if (!isActive()) {
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
				setClaimDropStage(currentDropStage);
				setAssetTotal(saleData.amountForSale);
				setAssetsMinted(saleData.amountSold);
				setFailedToLoad(false);
			} catch (err) {
				console.error(err);
				setRefetch(refetch + 1);
				setFailedToLoad(true);
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		},
		[library, claimInstance],
	);

	/**
	 * Get user-specific variables whenever mint amount or account changes
	 */
	useAsyncEffect(
		async (isActive) => {
			if (!claimInstance || !library || !account) {
				return;
			}
			// Get user data if wallet connected
			if (account && library) {
				try {
					setIsClaimDataLoading(true);
					const claimingIDs = await claimInstance.getClaimingIDsForUser(
						account,
					);

					if (!isActive()) {
						return;
					}
					setEligibleDomains(claimingIDs.filter((i) => i.canBeClaimed));
				} catch (err) {
					console.log(err);
				}
				setIsClaimDataLoading(false);
			}
		},
		[account, library, claimInstance, dropStage],
	);

	/**
	 * Gets and sets what stage the sale is in
	 */
	useAsyncEffect(
		async (isActive) => {
			if (!claimInstance || !library) {
				return;
			}

			try {
				const saleData = await claimInstance.getSaleData();
				const currentDropStage = await getDropStage(claimInstance);

				if (!isActive()) {
					return;
				}
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
					setClaimDropStage(currentDropStage);
					setAssetTotal(saleData.amountForSale);
					setAssetsMinted(saleData.amountSold);
					setFailedToLoad(false);
				}
			} catch (err) {
				if (!failedToLoad) {
					setTimeout(() => {
						setRefetch(refetch + 1);
					}, 7000);
				}
				setFailedToLoad(true);
			}

			// eslint-disable-next-line react-hooks/exhaustive-deps
		},
		[hasCountdownFinished, refetch, library, claimInstance],
	);

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
					if (assetTotal !== undefined && sold.toNumber() >= assetTotal) {
						setDropStage(Stage.Sold);
						setClaimDropStage(Stage.Sold);
					}
					setAssetsMinted(sold.toNumber());
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
					assetsMinted,
					assetTotal,
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
						isClaimingInProgress={isClaimingInProgress}
						isClaimDataLoading={isClaimDataLoading}
						setEligibleDomains={setEligibleDomains}
						setIsClaimingInProgress={setIsClaimingInProgress}
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
					onClose={onClose}
					onSubmit={onSubmit}
					eligibleDomains={eligibleDomains}
					isClaimingInProgress={isClaimingInProgress}
					isClaimDataLoading={isClaimDataLoading}
					setEligibleDomains={setEligibleDomains}
					setIsClaimingInProgress={setIsClaimingInProgress}
				/>
			)}
		</>
	);
};

export default ClaimNFTContainer;
