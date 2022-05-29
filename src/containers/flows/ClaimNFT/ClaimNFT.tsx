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
import { StepContent, Step } from './ClaimNFT.types';

//- Constants Imports
import {
	STEP_BAR_HEADING,
	STEP_CONTENT_TITLES,
	ERRORS,
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
	const { active } = useWeb3React<Web3Provider>();
	const { push: goTo } = useHistory();
	const [currentStep, setCurrentStep] = useState<Step>(Step.Details);
	const [stepContent, setStepContent] = useState<StepContent>(
		StepContent.Details,
	);
	const [error, setError] = useState<string | undefined>();

	// Prevent state update to unmounted component
	const isMounted = useRef(false);

	// replace
	const ownedQuantity = 5;
	// update to ownedQuantity > 0 && hasUnclaimedMotos or something
	const isClaimable = ownedQuantity > 0;

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

	const onClaim = () => {
		// try / catch
		setCurrentStep(Step.Minting);
		setStepContent(StepContent.Minting);
	};

	const onFinish = () => {
		onClose();
	};

	// replace hardcode
	const onRedirect = () => {
		goTo(ROUTES.MARKET + '/wheels.genesis');
		onClose();
	};

	const onCheck = () => {
		console.log('onCheck');
		// replace
		const tokenClaimed = true;
		const unableToRetrieve = false;
		if (tokenClaimed) {
			setError(ERRORS.CLAIM_CONSUMED);
		} else if (unableToRetrieve) {
			setError(ERRORS.UNABLE_TO_RETRIEVE);
		}
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
		[StepContent.Details]: (
			<Details
				ownedQuantity={ownedQuantity}
				isWalletConnected={active}
				isClaimable={isClaimable}
				currentStep={currentStep}
				error={error}
				connectToWallet={openConnect}
				onStartClaim={onStartClaim}
				onRedirect={onRedirect}
				onCheck={onCheck}
			/>
		),
		[StepContent.Claim]: (
			<Claiming ownedQuantity={ownedQuantity} onClaim={onClaim} error={error} />
		),
		[StepContent.Minting]: (
			<Details
				isWalletConnected={active}
				isClaimable={isClaimable}
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
