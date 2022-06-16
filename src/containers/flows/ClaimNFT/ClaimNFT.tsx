// React Imports
import { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

//- Global Component Imports
import { Wizard, StepBar } from 'components';

//- Components Imports
import Details from './components/WizardSteps/Details/Details';
import Claiming from './components/WizardSteps/Claiming/Claiming';

//- Types Imports
import { StepContent, Step, ClaimData } from './ClaimNFT.types';

//- Constants Imports
import {
	STEP_BAR_HEADING,
	STEP_CONTENT_TITLES,
	LOADING_TEXT,
	DOMAINS,
} from './ClaimNFT.constants';
import { ROUTES } from 'constants/routes';

//- Styles Imports
import styles from './ClaimNFT.module.scss';
import { useZSaleSdk } from 'lib/hooks/sdk';
import { IDWithClaimStatus } from '@zero-tech/zsale-sdk';

export type ClaimNFTProps = {
	openConnect: () => void;
	onClose: () => void;
	onSubmit: (data: ClaimData) => void;
	eligibleDomains: IDWithClaimStatus[];
	isClaimingInProgress?: boolean;
	isClaimDataLoading?: boolean;
	setEligibleDomains: React.Dispatch<React.SetStateAction<IDWithClaimStatus[]>>;
	setIsClaimingInProgress: (state: boolean) => void;
};

const ClaimNFT = ({
	openConnect,
	onClose,
	onSubmit,
	eligibleDomains,
	isClaimingInProgress,
	isClaimDataLoading,
	setEligibleDomains,
	setIsClaimingInProgress,
}: ClaimNFTProps) => {
	const isMounted = useRef(false);
	//////////////////
	// State & Data //
	//////////////////
	const { claimInstance } = useZSaleSdk();
	const { active } = useWeb3React<Web3Provider>();
	const { push: goTo } = useHistory();
	const [tokenID, setTokenID] = useState<string | undefined>();
	const [currentStep, setCurrentStep] = useState<Step>(Step.Details);
	const [transactionStatus, setTransactionStatus] = useState<string>();
	const [transactionError, setTransactionError] = useState<
		string | undefined
	>();
	const [stepContent, setStepContent] = useState<StepContent>(
		StepContent.Details,
	);

	///////////////
	// Functions //
	///////////////

	const onStepNavigation = async (i: number) => {
		if (currentStep === Step.Minting) {
			return;
		}
		setCurrentStep(i);
		setStepContent(i);
		const saleData = await claimInstance.getSaleData();
		console.log('saleData', saleData);
	};

	const onStartClaim = () => {
		setTransactionError('');
		setCurrentStep(Step.Claim);
		setStepContent(StepContent.Claim);
	};

	const onClaim = (quantity: number) => {
		setTransactionError('');

		const statusCallback = (status: string) => {
			setTransactionStatus(status);
		};

		const errorCallback = (error: string) => {
			setTransactionError(error);
		};

		// Set Minting Step
		const finishedCallback = () => {
			setCurrentStep(Step.Minting);
			setStepContent(StepContent.Minting);
		};

		const data: ClaimData = {
			quantity,
			eligibleDomains,
			setEligibleDomains,
			setIsClaimingInProgress,
			statusCallback,
			finishedCallback,
			errorCallback,
		};

		onSubmit(data);
	};

	const onRedirect = () => {
		goTo(ROUTES.MARKET + DOMAINS.ELIGIBLE_NFT_ROUTE);
		onClose();
	};

	const onFinish = () => {
		onClose();
		setTransactionStatus('');
	};

	/////////////
	// Effects //
	/////////////

	// Set step if disconnected
	useEffect(() => {
		if (!active && currentStep !== Step.Details) {
			setCurrentStep(Step.Details);
			setStepContent(StepContent.Details);
		}
	}, [active, currentStep]);

	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);
	///////////////
	// Fragments //
	///////////////

	const content = {
		[StepContent.Details]: !isClaimDataLoading ? (
			<Details
				tokenID={tokenID}
				isClaimDataLoading={isClaimDataLoading}
				eligibleDomains={eligibleDomains}
				isWalletConnected={active}
				currentStep={currentStep}
				connectToWallet={openConnect}
				onStartClaim={onStartClaim}
				onRedirect={onRedirect}
				setTokenID={setTokenID}
			/>
		) : (
			<div className={styles.LoadingContent}>
				<Wizard.Loading message={LOADING_TEXT.LOADING_DETAILS} />
			</div>
		),
		[StepContent.Claim]: (
			<Claiming
				eligibleDomains={eligibleDomains}
				apiError={transactionError}
				statusText={transactionStatus}
				onClaim={onClaim}
				isClaiming={isClaimingInProgress}
			/>
		),
		[StepContent.Minting]: (
			<Details
				isWalletConnected={active}
				currentStep={currentStep}
				onFinish={onFinish}
			/>
		),
	};

	////////////
	// Render //
	////////////
	return (
		<Wizard header={STEP_CONTENT_TITLES[stepContent]} sectionDivider={false}>
			<div className={styles.StepBarContainer}>
				<StepBar
					step={currentStep + 1}
					steps={STEP_BAR_HEADING}
					onNavigate={onStepNavigation}
				/>
			</div>
			{content[stepContent]}
		</Wizard>
	);
};

export default ClaimNFT;
