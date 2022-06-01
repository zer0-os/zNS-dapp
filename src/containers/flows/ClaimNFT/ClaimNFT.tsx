// React Imports
import { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

//- Global Component Imports
import { Wizard, StepBar } from 'components';

//- Hook Imports
import useOwnedDomains from 'lib/hooks/useOwnedDomains';

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

export type ClaimNFTProps = {
	openConnect: () => void;
	onClose: () => void;
	onSubmit: (data: ClaimData) => void;
};

const ClaimNFT = ({ openConnect, onClose, onSubmit }: ClaimNFTProps) => {
	//////////////////
	// State & Data //
	//////////////////

	const [tokenID, setTokenID] = useState<string | undefined>();
	const [currentStep, setCurrentStep] = useState<Step>(Step.Details);
	const [transactionError, setTransactionError] = useState<
		string | undefined
	>();
	const [transactionStatus, setTransactionStatus] = useState<string>();
	const [stepContent, setStepContent] = useState<StepContent>(
		StepContent.Details,
	);
	const isMounted = useRef(false);
	const { active, account } = useWeb3React<Web3Provider>();
	const { push: goTo } = useHistory();
	const { isLoading, ownedDomains } = useOwnedDomains(account);
	const eligibleDomains = ownedDomains?.filter((domain) =>
		domain.name.includes(DOMAINS.WHEELS_DOMAIN_NAME),
	);

	///////////////
	// Functions //
	///////////////

	const onStepNavigation = (i: number) => {
		setCurrentStep(i);
		setStepContent(i);
	};

	const onStartClaim = () => {
		setTransactionError('');
		setCurrentStep(Step.Claim);
		setStepContent(StepContent.Claim);
	};

	const onClaim = (quantity: number) => {
		setTransactionError('');

		// REMOVE STEPS WHEN TX ADDED AND CALLBACKS WIRED UP
		setCurrentStep(Step.Minting);
		setStepContent(StepContent.Minting);

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

		// ADD CLAIMS DOMAINS AND PASS eligibleDomains
		const data: ClaimData = {
			quantity,
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
		[StepContent.Details]: !isLoading ? (
			<Details
				tokenID={tokenID}
				isClaimDataLoading={isLoading}
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
			/>
		),
		[StepContent.Minting]: (
			<Details
				isWalletConnected={active}
				currentStep={currentStep}
				onFinish={onClose}
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
