import { Wizard } from 'components';
import { Step, StepStatus, StepWizard, MintData } from './MintDAO.types';
import { TITLES, MESSAGES, BUTTONS } from './MintDAO.constants';
import { MintDAOForm } from './elements';

/**
 *
 * 03/22/0222 Note by Joon:
 *
 * This helper function will be updated with some hooks when the SDK function is integrated
 * We are using local helpers for now
 */

export const formatMintWizard = (
	step: Step,
	stepStatus: StepStatus,
	mintData: MintData | undefined,
	error: string | undefined,
	onChangeStep: (step: Step) => () => void,
	onChangeStepStatus: (stepStatus: StepStatus) => () => void,
	onChangeMintData: (mintData: MintData) => void,
): StepWizard | null => {
	if (step === Step.Unlock) {
		const title = TITLES[step][stepStatus];
		const children =
			stepStatus === StepStatus.Normal ? (
				<Wizard.Confirmation
					error={error}
					message={MESSAGES[step][stepStatus]}
					primaryButtonText={BUTTONS[step].PRIMARY}
					secondaryButtonText={BUTTONS[step].SECONDARY}
					onClickPrimaryButton={onChangeStepStatus(StepStatus.Confirm)}
					onClickSecondaryButton={onChangeStep(Step.None)}
				/>
			) : (
				<Wizard.Loading message={MESSAGES[step][stepStatus]} />
			);

		return {
			title,
			children,
		} as StepWizard;
	}

	if (step === Step.Mint) {
		const title = TITLES[step][stepStatus];
		const children =
			stepStatus === StepStatus.Normal ? (
				<Wizard.Confirmation
					error={error}
					message={
						<MintDAOForm mintData={mintData} onChange={onChangeMintData} />
					}
					primaryButtonText={BUTTONS[step].PRIMARY}
					isPrimaryButtonActive={
						Boolean(mintData?.daoName) && Boolean(mintData?.gnosisSafeAddress)
					}
					secondaryButtonText={BUTTONS[step].SECONDARY}
					onClickPrimaryButton={onChangeStepStatus(StepStatus.Confirm)}
					onClickSecondaryButton={onChangeStep(Step.None)}
				/>
			) : (
				<Wizard.Loading message={MESSAGES[step][stepStatus]} />
			);

		return {
			title,
			children,
		} as StepWizard;
	}

	return null;
};
