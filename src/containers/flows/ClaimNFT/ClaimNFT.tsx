//- React Imports
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

//- Web3 Imports
import { useWeb3 } from 'lib/web3-connection/useWeb3';

//- Global Component Imports
import { StepBar, Wizard } from 'components';

//- Library Imports
import { ClaimableDomain } from '@zero-tech/zsale-sdk';

//- Components Imports
import Details from './components/WizardSteps/Details/Details';
import Claiming from './components/WizardSteps/Claiming/Claiming';

//- Types Imports
import { ClaimData, Step, StepContent } from './ClaimNFT.types';

//- Constants Imports
import {
	DOMAINS,
	LOADING_TEXT,
	STEP_BAR_HEADING,
	STEP_CONTENT_TITLES,
} from './ClaimNFT.constants';
import { ROUTES } from 'constants/routes';

//- Styles Imports
import styles from './ClaimNFT.module.scss';

export type ClaimNFTProps = {
	openConnect: () => void;
	onClose: () => void;
	onSubmit: (data: ClaimData) => void;
	eligibleDomains: ClaimableDomain[];
	isClaimingInProgress?: boolean;
	isClaimDataLoading?: boolean;
	setEligibleDomains: React.Dispatch<React.SetStateAction<ClaimableDomain[]>>;
	setIsClaimingInProgress: (state: boolean) => void;
	isSaleStatusLoading?: boolean;
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
	isSaleStatusLoading,
}: ClaimNFTProps) => {
	//////////////////
	// State & Data //
	//////////////////
	const { isActive } = useWeb3();
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
	};

	const onStartClaim = () => {
		setTransactionError('');
		setCurrentStep(Step.Claim);
		setStepContent(StepContent.Claim);
	};

	const onClaim = (quantity: number) => {
		setTransactionError('');

		const setStatus = (status: string) => {
			setTransactionStatus(status);
		};

		const onError = (error: string) => {
			setTransactionError(error);
		};

		// Set Minting Step
		const onFinish = () => {
			setCurrentStep(Step.Minting);
			setStepContent(StepContent.Minting);
		};

		const data: ClaimData = {
			quantity,
			eligibleDomains,
			setEligibleDomains,
			setIsClaimingInProgress,
			setStatus,
			onError,
			onFinish,
		};

		onSubmit(data);
	};

	const onRedirect = () => {
		goTo(ROUTES.MARKET + DOMAINS.ELIGIBLE_NFT_ROUTE);
		onClose();
	};

	const onFinish = () => {
		setTransactionStatus('');
		onClose();
	};

	/////////////
	// Effects //
	/////////////

	// Set step if disconnected
	useEffect(() => {
		if (!isActive) {
			setCurrentStep(Step.Details);
			setStepContent(StepContent.Details);
		}
	}, [isActive, currentStep]);

	///////////////
	// Fragments //
	///////////////

	const content = {
		[StepContent.Details]:
			!isClaimDataLoading && !isSaleStatusLoading ? (
				<Details
					tokenID={tokenID}
					isClaimDataLoading={isClaimDataLoading}
					eligibleDomains={eligibleDomains}
					isWalletConnected={isActive}
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
				isWalletConnected={isActive}
				currentStep={currentStep}
				onFinish={onFinish}
				isClaiming={isClaimingInProgress}
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
