/*
 This container is for the Mint Wheels flow. It should be
 replaced by a more generic container for minting procedurally
 generated NFTs in the future.
 */

// React Imports
import { useEffect, useState } from 'react';

// Step Imports
import Loading from './steps/Loading/Loading';
import Info from './steps/Info/Info';
import SelectAmount from './steps/SelectAmount/SelectAmount';
import InsufficientFunds from './steps/InsufficientFunds/InsufficientFunds';

// Configuration
import { Stage, Step, PrimaryData } from './types';
import {
	EthPerWheel,
	getPrimaryData,
	getBalanceEth,
	getUserEligibility,
} from './helpers';

// Style Imports
import styles from './MintWheels.module.css';

type MintWheelsProps = {
	balanceEth?: number;
	dropStage?: Stage;
	isUserWhitelisted?: boolean;
	userId?: string;
	wheelsTotal?: number;
	wheelsMinted?: number;
	onSubmitTransaction: (numWheels: number) => void;
};

const MintWheels = (props: MintWheelsProps) => {
	//////////////////
	// State & Data //
	//////////////////

	const [step, setStep] = useState<Step>(Step.Info);

	///////////////
	// Functions //
	///////////////

	const onContinueFromInfo = () => {
		// Set step to "choose amount"
		// if (balanceEth !== undefined) {
		// 	if (balanceEth < EthPerWheel) {
		// 		setStep(Step.InsufficientFunds);
		// 	} else {
		// 		setStep(Step.SelectAmount);
		// 	}
		// }
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

	const getFlowSection = () => {
		if (props.dropStage === undefined) {
			return;
		}
		if (step === Step.Info) {
			return (
				<Info
					dropStage={props.dropStage!}
					isUserWhitelisted={props.isUserWhitelisted}
					isWalletConnected={props.userId !== undefined}
					onContinue={onContinueFromInfo!}
					wheelsMinted={props.wheelsMinted!}
					wheelsTotal={props.wheelsTotal!}
				/>
			);
		}
		if (step === Step.SelectAmount) {
			return (
				<SelectAmount
					balanceEth={1000}
					onBack={onBack}
					onContinue={submitTransaction}
					remainingWheels={props.wheelsTotal! - props.wheelsMinted!}
					error={'User rejected transaction'}
				/>
			);
		}
		if (step === Step.PendingWalletApproval) {
			return <Loading text={'Pending wallet approval'} />;
		}
		if (step === Step.InsufficientFunds) {
			return (
				<InsufficientFunds
					onDismiss={() => {
						console.log('dismiss');
					}}
				/>
			);
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
			{props.dropStage === undefined && (
				<Loading text={'Loading Wheels Drop'} />
			)}
			{getFlowSection()}
		</div>
	);
};

export default MintWheels;
