/* eslint-disable react-hooks/exhaustive-deps */
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
import Approval from './steps/Approval/Approval';
import SelectAmount from './steps/SelectAmount/SelectAmount';
import InsufficientFunds from './steps/InsufficientFunds/InsufficientFunds';
import Finished from './steps/Finished/Finished';

import { ERC20, WhitelistSimpleSale } from 'types';

// Configuration
import { Stage, Step, TransactionData } from './types';

// Style Imports
import styles from './MintDropNFTWizard.module.scss';
import { Wizard } from 'components';

export type MintDropNFTWizardProps = {
	balanceEth?: number;
	contract?: WhitelistSimpleSale;
	dropStage?: Stage;
	onClose: () => void;
	onFinish: () => void;
	isUserWhitelisted?: boolean;
	maxPurchasesPerUser?: number;
	numberPurchasedByUser?: number;
	userId?: string;
	wheelsTotal?: number;
	wheelsMinted?: number;
	pricePerNFT: number;
	onSubmitTransaction: (data: TransactionData) => void;
	token?: ERC20;
};

const MintDropNFTWizard = (props: MintDropNFTWizardProps) => {
	//////////////////
	// State & Data //
	//////////////////

	const [step, setStep] = useState<Step>(Step.Info);

	const [transactionStatus, setTransactionStatus] = useState<string>(
		'Confirm wallet transaction to begin minting your Wheels',
	);
	const [transactionError, setTransactionError] = useState<
		string | undefined
	>();

	///////////////
	// Functions //
	///////////////

	const onContinueFromInfo = () => {
		if (props.balanceEth !== undefined) {
			if (props.balanceEth < props.pricePerNFT) {
				setStep(Step.InsufficientFunds);
			} else {
				setStep(Step.SelectAmount);
			}
		} else {
			setStep(Step.CheckingBalance);
		}
	};

	const onCheckApprovalError = (error: string) => {
		setStep(Step.Info);
		setTransactionError(error);
	};

	const submitTransaction = (numWheels: number) => {
		// Switch to "pending wallet approval" step
		setStep(Step.PendingWalletApproval);
		setTransactionError(undefined);

		const statusCallback = (status: string) => {
			setTransactionStatus(status);
		};

		const errorCallback = (error: string) => {
			setStep(Step.Info);
			setTransactionError(error);
		};

		const finishedCallback = () => {
			setStep(Step.Finished);
		};

		const data: TransactionData = {
			numWheels,
			statusCallback,
			errorCallback,
			finishedCallback,
		};
		props.onSubmitTransaction(data);
	};

	const onBack = () => {
		if (step === Step.InsufficientFunds || step === Step.SelectAmount) {
			setStep(Step.Info);
		}
	};

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		if (props.balanceEth !== undefined && step === Step.CheckingBalance) {
			setStep(Step.SelectAmount);
		}
	}, [props.balanceEth]);

	///////////////
	// Fragments //
	///////////////

	const getFlowSection = () => {
		if (props.dropStage === undefined) {
			return;
		}
		if (step === Step.Info) {
			return (
				<Info
					dropStage={props.dropStage!}
					errorMessage={transactionError}
					isUserWhitelisted={props.isUserWhitelisted}
					isWalletConnected={props.userId !== undefined}
					maxPurchasesPerUser={props.maxPurchasesPerUser}
					pricePerNFT={props.pricePerNFT}
					numberPurchasedByUser={props.numberPurchasedByUser}
					onContinue={onContinueFromInfo!}
					onDismiss={props.onClose}
					wheelsMinted={props.wheelsMinted!}
					wheelsTotal={props.wheelsTotal!}
				/>
			);
		}
		if (step === Step.Approval) {
			return (
				<Approval
					contract={props.contract!}
					token={props.token!}
					userId={props.userId!}
					onApproval={() => submitTransaction(1)}
					onError={onCheckApprovalError}
					onCancel={props.onClose}
				/>
			);
		}
		if (step === Step.SelectAmount) {
			return (
				<SelectAmount
					balanceEth={props.balanceEth!}
					error={transactionError}
					pricePerNFT={props.pricePerNFT}
					maxPurchasesPerUser={props.maxPurchasesPerUser}
					numberPurchasedByUser={props.numberPurchasedByUser!}
					onBack={onBack}
					onContinue={submitTransaction}
					remainingWheels={props.wheelsTotal! - props.wheelsMinted!}
				/>
			);
		}
		if (step === Step.CheckingBalance) {
			return <Loading text={'Checking your ETH balance'} />;
		}
		if (step === Step.PendingWalletApproval) {
			return <Loading isMinting text={transactionStatus} />;
		}
		if (step === Step.InsufficientFunds) {
			return (
				<InsufficientFunds
					pricePerNFT={props.pricePerNFT}
					onDismiss={props.onClose}
				/>
			);
		}
		if (step === Step.Finished) {
			return <Finished onFinish={props.onFinish} />;
		}
	};

	////////////
	// Render //
	////////////

	return (
		<Wizard
			header="Mint Your Kicks"
			subHeader="Your Kicks in the Metaverse await"
			className={`${styles.Container} border-primary border-rounded`}
		>
			{props.dropStage === undefined && <Loading text={'Loading Kicks Drop'} />}
			{getFlowSection()}
		</Wizard>
	);
};

export default MintDropNFTWizard;
