/*
 This container is for the Mint Wheels flow. It should be
 replaced by a more generic container for minting procedurally
 generated NFTs in the future.
 */

// React Imports
import { useEffect, useState } from 'react';

// Web3 Imports
import { useWeb3React } from '@web3-react/core';

// Step Imports
import Loading from './steps/Loading/Loading';
import Info from './steps/Info/Info';
import SelectAmount from './steps/SelectAmount/SelectAmount';
import InsufficientFunds from './steps/InsufficientFunds/InsufficientFunds';

// Configuration
import { Stage, Step, PrimaryData } from './types';
import { EthPerWheel, getPrimaryData, getBalanceEth } from './helpers';

// Style Imports
import styles from './MintWheels.module.css';

const MintWheels = () => {
	//////////////////
	// State & Data //
	//////////////////

	const { account } = useWeb3React();

	const [step, setStep] = useState<Step>(Step.LoadingPrimary);

	// Have split data up into two different sets:
	// - Primary data: the minimal data we need to show the first screen in flow
	// - Secondary data: data that isn't on the first page, i.e. isn't needed instantly

	// Flags for "has drop data finished loading?"
	const [isLoadingPrimaryData, setIsLoadingPrimaryData] =
		useState<boolean>(true);
	const [isLoadingSecondaryData, setIsLoadingSecondaryData] =
		useState<boolean>(true);

	// Primary data - data this is needed on first render
	const [dropStage, setDropStage] = useState<Stage | undefined>();
	const [isUserEligible, setIsUserEligible] = useState<boolean | undefined>();
	const [wheelsTotal, setWheelsTotal] = useState<number | undefined>();
	const [wheelsMinted, setWheelsMinted] = useState<number | undefined>();

	// Secondary data - data that isn't needed on first render
	const [balanceEth, setBalanceEth] = useState<number | undefined>();

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		if (isLoadingPrimaryData) {
			setStep(Step.LoadingPrimary);
		} else {
			setStep(Step.Info);
		}
	}, [isLoadingPrimaryData]);

	// Get all data on enter DOM
	useEffect(() => {
		let isMounted = true;

		setIsLoadingPrimaryData(true);

		if (!account) {
			return;
		}

		const getData = async () => {
			getPrimaryData(account)
				.then((d) => {
					if (!isMounted) {
						return;
					}
					const primaryData = d as PrimaryData;
					setPrimaryData(d as PrimaryData);
					setIsLoadingPrimaryData(false);
				})
				.catch((e) => {
					console.log('failed to load');
					console.error(e);
				});
			// Start the secondary data
		};
		getData();

		// Gets all the data we can load last (req. > step 2)
		const getSecondaryData = async () => {
			const [balanceEth] = await Promise.all([getBalanceEth()]);

			// Unsubscribe if not mounted
			if (!isMounted) {
				return;
			}

			setBalanceEth(balanceEth);

			setIsLoadingSecondaryData(false);
		};
		getSecondaryData();

		return () => {
			isMounted = false;
		};
	}, [account]);

	///////////////
	// Functions //
	///////////////

	const setPrimaryData = (primaryData: PrimaryData) => {
		setDropStage(primaryData.dropStage);
		setIsUserEligible(primaryData.isUserEligible);
		setWheelsTotal(primaryData.wheelsTotal);
		setWheelsMinted(primaryData.wheelsMinted);
	};

	const onContinueFromInfo = () => {
		// Set step to "choose amount"
		if (!isLoadingSecondaryData && balanceEth !== undefined) {
			if (balanceEth < EthPerWheel) {
				setStep(Step.InsufficientFunds);
			} else {
				setStep(Step.SelectAmount);
			}
		}
	};

	const submitTransaction = (numWheels: number) => {
		// Switch to "pending wallet approval" step
		setStep(Step.PendingWalletApproval);
	};

	const onBack = () => {
		if (step === Step.InsufficientFunds || step === Step.SelectAmount) {
			setStep(Step.Info);
		}
	};

	////////////
	// Render //
	////////////

	return (
		<div className={`${styles.Container} border-primary border-rounded`}>
			{/* Head section */}
			<section className={styles.Header}>
				<h1 className="glow-text-white">Mint Your Wheels</h1>
				<span className="glow-text-white">
					Your ride in the metaverse awaits
				</span>
				<hr />
			</section>
			{step === Step.LoadingPrimary && <Loading text={'Loading Wheels Drop'} />}
			{step === Step.Info && (
				<Info
					dropStage={dropStage!}
					isUserEligible={isUserEligible!}
					isWalletConnected={account !== undefined}
					onContinue={onContinueFromInfo!}
					wheelsMinted={wheelsMinted!}
					wheelsTotal={wheelsTotal!}
				/>
			)}
			{step === Step.LoadingSecondary && (
				<Loading text={'Checking your wallet'} />
			)}
			{step === Step.SelectAmount && (
				<SelectAmount
					balanceEth={balanceEth!}
					onBack={onBack}
					onContinue={submitTransaction}
					remainingWheels={wheelsTotal! - wheelsMinted!}
					error={'User rejected transaction'}
				/>
			)}
			{step === Step.PendingWalletApproval && (
				<Loading text={'Pending wallet approval'} />
			)}
			{step === Step.InsufficientFunds && (
				<InsufficientFunds
					onDismiss={() => {
						console.log('dismiss');
					}}
				/>
			)}
		</div>
	);
};

export default MintWheels;
