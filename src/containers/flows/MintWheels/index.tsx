// React Imports
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

// Web3 Imports
import { useWeb3React } from '@web3-react/core';
import { useZnsContracts } from 'lib/contracts';
import { Web3Provider } from '@ethersproject/providers';

// Component Imports
import { MintWheelsBanner, Overlay } from 'components';
import MintWheels from './MintWheels';

// Library Imports
import { Stage, DropData, TransactionData } from './types';
import { getBannerLabel, getBannerButtonText } from './labels';
import { useMintProvider } from 'lib/providers/MintProvider';
import {
	getDropData,
	getUserEligibility,
	getNumberPurchasedByUser,
	getERC20TokenBalance,
} from './helpers';

const MintWheelsFlowContainer = () => {
	// Hardcoded dates
	const DATE_PUBLIC = 1638666000000;

	//////////////////
	// State & Data //
	//////////////////

	const { mintWheels } = useMintProvider();
	const history = useHistory();
	const location = useLocation();

	// Web3 hooks
	const { account, library } = useWeb3React<Web3Provider>();

	// Contracts
	const contracts = useZnsContracts();
	const saleContract = contracts?.wheelSale;
	const wildTokenContract = contracts?.wildToken;

	// Internal State
	const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
	const [canOpenWizard, setCanOpenWizard] = useState<boolean>(false);
	const [numMinted, setNumMinted] = useState<number>(0);
	const [countdownDate, setCountdownDate] = useState<number | undefined>();
	const [hasCountdownFinished, setHasCountdownFinished] =
		useState<boolean>(false);

	// Auction data
	const [dropStage, setDropStage] = useState<Stage | undefined>();
	const [wheelsTotal, setWheelsTotal] = useState<number | undefined>();
	const [wheelsMinted, setWheelsMinted] = useState<number | undefined>();
	const [maxPurchasesPerUser, setMaxPurchasesPerUser] = useState<
		number | undefined
	>();
	const [failedToLoad, setFailedToLoad] = useState<boolean>(false);
	const [refetch, setRefetch] = useState<number>(0);

	// User data
	const [isUserWhitelisted, setIsUserWhitelisted] = useState<
		boolean | undefined
	>();
	const [balanceEth, setBalanceEth] = useState<number | undefined>();
	const [numberPurchasedByUser, setNumberPurchasedByUser] = useState<
		number | undefined
	>();

	// NOTE: TEMPORARY FOR SALE HALT
	const isSaleHalted = false;

	///////////////
	// Functions //
	///////////////

	const transactionSuccessful = (numWheels: number) => {
		setNumMinted(numMinted + numWheels); // Increment to trigger re-fetch
		setNumberPurchasedByUser(numberPurchasedByUser! + numWheels);
	};

	// Open/close the Mint wizard
	const openWizard = (event: any) => {
		if (event.target.nodeName.toLowerCase() === 'a') {
			return;
		}
		if (isSaleHalted) {
			window?.open('https://discord.gg/mb9fcFey8a', '_blank')?.focus();
			return;
		}
		if (dropStage === Stage.Upcoming || !canOpenWizard || failedToLoad) {
			window?.open('https://discord.gg/mb9fcFey8a', '_blank')?.focus();
		} else if (dropStage === Stage.Sold) {
			history.push('cribs.wiami.southbeach.qube');
		} else {
			setIsWizardOpen(true);
		}
	};

	const closeWizard = () => {
		setIsWizardOpen(false);
	};

	// Toggles to grid view when viewport
	// resizes to below 700px
	const handleResize = () => {
		setCanOpenWizard(window.innerWidth >= 900);
	};

	const countdownFinished = () => {
		setHasCountdownFinished(true);
	};

	// Run a few things after the transaction succeeds
	// const transactionSuccessful = (numWheels: number) => {};

	// Submits transaction, feeds status updates
	// back through the callbacks provided by MintWheels
	const onSubmitTransaction = async (data: TransactionData) => {
		const { numWheels, statusCallback, errorCallback, finishedCallback } = data;
		if (!isSaleHalted) {
			const combinedFinishedCallback = () => {
				transactionSuccessful(numWheels);
				finishedCallback();
			};
			mintWheels(
				numWheels,
				statusCallback,
				combinedFinishedCallback,
				errorCallback,
			);
		} else {
			errorCallback('Sale has ended');
		}
	};

	const openProfile = () => {
		setIsWizardOpen(false);

		const params = new URLSearchParams(location.search);
		params.set('profile', 'true');
		history.push({
			pathname: location.pathname,
			search: params.toString(),
		});
	};

	// Handler for domain purchase events from contract
	// Method gets called once per wheel
	const onDomainPurchased = useCallback((d: any) => {
		if (wheelsMinted !== undefined) {
			setWheelsMinted(wheelsMinted + 1);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		window.addEventListener('resize', handleResize);
		handleResize();
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	// Get sale data
	useEffect(() => {
		let isMounted = true;

		// Generally this would be < DATE_WHITELIST & < DATE_PUBLIC
		// but given time constraints we're just going to compare
		// to DATE_PUBLIC
		if (isSaleHalted) {
			setCountdownDate(DATE_PUBLIC);
			setFailedToLoad(false);
			return;
		}

		const getData = async () => {
			if (!saleContract) {
				return;
			}

			// Get the data related to the drop
			getDropData(saleContract)
				.then((d) => {
					if (!isMounted) {
						return;
					}
					const primaryData = d as DropData;
					if (primaryData.dropStage === Stage.Upcoming) {
						setCountdownDate(undefined);
						setTimeout(() => {
							setRefetch(refetch + 1);
						}, 7000);
					} else if (primaryData.dropStage === Stage.Whitelist) {
						setCountdownDate(DATE_PUBLIC);
					} else {
						setCountdownDate(undefined);
					}
					if (refetch > 0) {
						setCountdownDate(undefined);
					}
					setDropStage(primaryData.dropStage);
					setWheelsTotal(primaryData.wheelsTotal);
					setWheelsMinted(primaryData.wheelsMinted);
					setMaxPurchasesPerUser(primaryData.maxPurchasesPerUser);
					setFailedToLoad(false);
				})
				.catch((e) => {
					console.error(e);
					console.log('failed to get');
					setRefetch(refetch + 1);
					setFailedToLoad(true);
				});
		};
		getData();
		return () => {
			isMounted = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [library, saleContract, isSaleHalted]);

	// Get user eligibility
	useEffect(() => {
		let isMounted = true;
		if (!saleContract || isSaleHalted) {
			return;
		}
		// Get user data if wallet connected
		if (account && library) {
			getUserEligibility(account, saleContract).then((d) => {
				if (isMounted && d !== undefined) {
					setIsUserWhitelisted(d);
				}
			});
		} else {
			setIsUserWhitelisted(undefined);
		}
		return () => {
			isMounted = false;
		};
	}, [account, library, saleContract, isSaleHalted]);

	// Get user balance and number purchased
	useEffect(() => {
		let isMounted = true;
		if (!saleContract || isSaleHalted) {
			return;
		}
		// Get user data if wallet connected
		if (account && library && wildTokenContract) {
			getERC20TokenBalance(wildTokenContract, account).then((d) => {
				if (isMounted && d !== undefined) {
					setBalanceEth(d);
				}
			});
			getNumberPurchasedByUser(account, saleContract).then((d) => {
				if (isMounted && d !== undefined) {
					setNumberPurchasedByUser(d);
				}
			});
		} else {
			setBalanceEth(undefined);
			setNumberPurchasedByUser(undefined);
		}
		return () => {
			isMounted = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [numMinted, account, library, saleContract]);

	useEffect(() => {
		let isMounted = true;

		if (!saleContract || isSaleHalted) {
			return;
		}

		getDropData(saleContract)
			.then((d) => {
				if (!isMounted) {
					return;
				}
				const primaryData = d as DropData;
				if (dropStage !== undefined) {
					if (hasCountdownFinished && primaryData.dropStage === dropStage) {
						setTimeout(() => {
							setRefetch(refetch + 1);
						}, 7000);
						return;
					}
					if (primaryData.dropStage === Stage.Upcoming) {
						setCountdownDate(undefined);
						setTimeout(() => {
							setRefetch(refetch + 1);
						}, 7000);
					} else if (primaryData.dropStage === Stage.Whitelist) {
						setCountdownDate(DATE_PUBLIC);
					} else {
						setCountdownDate(undefined);
					}
					if (refetch > 0) {
						setCountdownDate(undefined);
					}
					setDropStage(primaryData.dropStage);
					setWheelsTotal(primaryData.wheelsTotal);
					setWheelsMinted(primaryData.wheelsMinted);
					setMaxPurchasesPerUser(primaryData.maxPurchasesPerUser);
				}
				if (!isSaleHalted) {
					setFailedToLoad(false);
				}
			})
			.catch((e) => {
				if (!failedToLoad) {
					setTimeout(() => {
						setRefetch(refetch + 1);
					}, 7000);
				}
				setFailedToLoad(true);
			});

		return () => {
			isMounted = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasCountdownFinished, refetch]);

	useEffect(() => {
		saleContract?.off('DomainPurchased', onDomainPurchased);
		if (
			saleContract &&
			(dropStage === Stage.Public || dropStage === Stage.Whitelist) &&
			!isSaleHalted &&
			!account
		) {
			// Listen to mints
			saleContract.on('DomainPurchased', onDomainPurchased);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dropStage, saleContract, isSaleHalted, account]);

	///////////////
	// Fragments //
	///////////////

	const bannerLabel = () => {
		if (isSaleHalted) {
			return (
				<>
					<span>
						Wilder Cribs sale has been temporarily paused to ensure a fair sale.
					</span>
					<span style={{ display: 'block', marginTop: 4 }}>
						Join our{' '}
						<b>
							<a
								href={'https://discord.gg/mb9fcFey8a'}
								target={'_blank'}
								rel={'noreferrer'}
							>
								Discord
							</a>
						</b>{' '}
						for more details.
					</span>
				</>
			);
		}
		return failedToLoad
			? 'Failed to load auction data - refresh to try again'
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
		return failedToLoad || isSaleHalted
			? 'Learn More'
			: getBannerButtonText(dropStage, canOpenWizard);
	};

	////////////
	// Render //
	////////////

	return (
		<>
			{canOpenWizard && isWizardOpen && !isSaleHalted && (
				<Overlay open onClose={closeWizard}>
					<MintWheels
						balanceEth={balanceEth}
						contract={saleContract}
						dropStage={dropStage}
						isUserWhitelisted={isUserWhitelisted}
						maxPurchasesPerUser={maxPurchasesPerUser}
						numberPurchasedByUser={numberPurchasedByUser}
						onClose={closeWizard}
						onFinish={openProfile}
						onSubmitTransaction={onSubmitTransaction}
						userId={account as string | undefined}
						wheelsMinted={wheelsMinted}
						wheelsTotal={wheelsTotal}
						token={wildTokenContract}
					/>
				</Overlay>
			)}
			<div style={{ position: 'relative', marginBottom: 16 }}>
				<MintWheelsBanner
					title={'Get your crib for the Metaverse '}
					label={bannerLabel()}
					buttonText={buttonText()}
					onClick={openWizard}
				/>
			</div>
		</>
	);
};

export default MintWheelsFlowContainer;
