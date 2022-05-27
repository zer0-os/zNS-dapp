// React Imports
import { useState } from 'react';
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
import { STEP_BAR_HEADING, STEP_CONTENT_TITLES } from './ClaimNFT.constants';
import { ROUTES } from 'constants/routes';

//- Styles Imports
import styles from './ClaimNFT.module.scss';

export type ClaimNFTProps = {
	isClaimable: boolean;
	openConnect: () => void;
	onClose: () => void;
};

const ClaimNFT = ({ isClaimable, openConnect, onClose }: ClaimNFTProps) => {
	//////////////////
	// State & Data //
	//////////////////
	const { active } = useWeb3React<Web3Provider>();
	const { push: goTo } = useHistory();
	const [currentStep, setCurrentStep] = useState<Step>(Step.Details);
	const [stepContent, setStepContent] = useState<StepContent>(
		StepContent.Details,
	);
	const [isClaimingNFT, setIsClaimingNFT] = useState<boolean>(false);
	const [error, setError] = useState<string | undefined>();

	///////////////
	// Functions //
	///////////////

	const onStepNavigation = (i: number) => {
		setCurrentStep(i);
		setStepContent(i);
	};

	const onStartClaimStep = () => {
		setError('');
		setCurrentStep(Step.Claim);
		setStepContent(StepContent.Claim);
	};

	const onClaim = () => console.log('trigger claim');

	// replace hardcode
	const onRedirect = () => {
		goTo(ROUTES.MARKET + '/wheels.genesis');
		onClose();
	};

	///////////////
	// Fragments //
	///////////////

	const content = {
		[StepContent.Details]: (
			<Details
				maxQuantity={0}
				isWalletConnected={active}
				isClaimable={isClaimable}
				error={error}
				connectToWallet={openConnect}
				onStartClaim={onStartClaimStep}
				onRedirect={onRedirect}
			/>
		),
		[StepContent.Claim]: (
			<Claiming maxQuantity={0} onClaim={onClaim} error={error} />
		),
		[StepContent.Minting]: <>MINTING</>,
	};

	////////////
	// Render //
	////////////
	return (
		<Wizard
			header={STEP_CONTENT_TITLES[stepContent]}
			sectionDivider={isClaimingNFT}
		>
			{!isClaimingNFT && (
				<div className={styles.StepBarContainer}>
					<StepBar
						step={currentStep + 1}
						steps={STEP_BAR_HEADING}
						onNavigate={onStepNavigation}
					/>
				</div>
			)}

			{content[stepContent]}
		</Wizard>
	);
};

export default ClaimNFT;
