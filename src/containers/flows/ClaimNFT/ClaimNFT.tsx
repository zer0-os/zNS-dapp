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
import { StepContent, Step } from './ClaimNFT.types';

//- Constants Imports
import {
	STEP_BAR_HEADING,
	STEP_CONTENT_TITLES,
	STATUS_TEXT,
	DOMAINS,
	MESSAGES,
} from './ClaimNFT.constants';
import { ROUTES } from 'constants/routes';

//- Styles Imports
import styles from './ClaimNFT.module.scss';

export type ClaimNFTProps = {
	openConnect: () => void;
	onClose: () => void;
};

const ClaimNFT = ({ openConnect, onClose }: ClaimNFTProps) => {
	//////////////////
	// State & Data //
	//////////////////

	const [tokenID, setTokenID] = useState<string | undefined>();
	const [currentStep, setCurrentStep] = useState<Step>(Step.Details);
	const [error, setError] = useState<string | undefined>();
	const [stepContent, setStepContent] = useState<StepContent>(
		StepContent.Details,
	);
	// const [isClaimComplete, setIsClaimComplete] = useState<boolean>(false);
	const { active, account } = useWeb3React<Web3Provider>();
	const { push: goTo } = useHistory();
	const isMounted = useRef(false);
	const { isLoading, ownedDomains } = useOwnedDomains(account);
	const eligibleDomains = ownedDomains?.filter((domain) =>
		// DOMAINS.WHEELS_DOMAIN_NAME in place
		domain.name.includes('.'),
	);

	///////////////
	// Functions //
	///////////////

	const onStepNavigation = (i: number) => {
		setCurrentStep(i);
		setStepContent(i);
	};

	const onStartClaim = () => {
		setError('');
		setCurrentStep(Step.Claim);
		setStepContent(StepContent.Claim);
	};

	const onClaim = async () => {
		console.log('onClaim');
		setError('');
		setCurrentStep(Step.Minting);
		setStepContent(StepContent.Minting);

		try {
			// claim nft
			// await claimNFT();
			// setIsClaimComplete(true);
			setCurrentStep(Step.Minting);
			setStepContent(StepContent.Minting);
		} catch (e) {
			setCurrentStep(Step.Claim);
			setError(MESSAGES.REJECTED_WALLET);
			setStepContent(StepContent.Claim);
		}
		if (!isMounted.current) return;
	};

	const onFinish = () => {
		console.log('onFinish');
		onClose();
	};

	// replace hardcode
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
				<Wizard.Loading message={STATUS_TEXT.LOADING_DETAILS} />
			</div>
		),
		[StepContent.Claim]: (
			<Claiming
				eligibleDomains={eligibleDomains}
				onClaim={onClaim}
				apiError={error}
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
