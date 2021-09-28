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
import { Stage, Step } from './types';
import {
	EthPerWheel,
	getDropStage,
	getUserEligibility,
	getWheelQuantities,
	getBalanceEth,
} from './helpers';

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

	// Get all data on enter DOM
	useEffect(() => {
		let isMounted = true;

		setIsLoadingPrimaryData(true);

		// Gets all the data we need initially for step 1
		const getPrimaryData = async () => {
			const [stage, eligible, quantity] = await Promise.all([
				getDropStage(),
				getUserEligibility(),
				getWheelQuantities(),
			]);

			// Unsubscribe if not mounted
			if (!isMounted) {
				return;
			}

			if (
				stage === undefined ||
				eligible === undefined ||
				quantity === undefined
			) {
				// Something went wrong in the loading
				// We shouldn't show the UI if any of these failed - maybe retry?
				setIsLoadingPrimaryData(true);
				return;
			}

			// Need to set a timeout so the "Loading" shows for a little longer
			await new Promise((r) => setTimeout(r, 1200));

			setIsLoadingPrimaryData(false); // Tell the UI the primary data has finished loading

			setDropStage(stage);
			setIsUserEligible(eligible);
			setWheelsTotal(quantity.total);
			setWheelsMinted(quantity.minted);
			setStep(Step.Info);
		};
		getPrimaryData();

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
	}, []);

	///////////////
	// Functions //
	///////////////

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
		// Set step - 1
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
