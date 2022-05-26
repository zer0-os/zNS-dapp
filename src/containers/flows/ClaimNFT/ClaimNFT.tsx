// React Imports
import { useState } from 'react';

//- Global Component Imports
import { Wizard, StepBar } from 'components';

//- Components Imports
import Details from './components/Details/Details';

//- Types Imports
import { StepContent, Step } from './ClaimNFT.types';

//- Constants Imports
import { STEP_BAR_HEADING, STEP_CONTENT_TITLES } from './ClaimNFT.constants';

//- Styles Imports
import styles from './ClaimNFT.module.scss';

export type ClaimNFTProps = {
	isWalletConnected: boolean;
	openConnect: () => void;
};

const ClaimNFT = ({ isWalletConnected, openConnect }: ClaimNFTProps) => {
	//////////////////
	// State & Data //
	//////////////////

	const [stepContent, setStepContent] = useState<StepContent>(
		StepContent.Details,
	);
	const [isClaimingNFT, setIsClaimingNFT] = useState<boolean>(false);

	const [currentStep, setCurrentStep] = useState<Step>(Step.Details);

	///////////////
	// Functions //
	///////////////

	const onStepNavigation = (i: number) => {
		setCurrentStep(i);
		setStepContent(i);
	};

	///////////////
	// Fragments //
	///////////////

	const content = {
		[StepContent.Details]: (
			<Details
				connectToWallet={openConnect}
				isWalletConnected={isWalletConnected}
				error={''}
			/>
		),
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
