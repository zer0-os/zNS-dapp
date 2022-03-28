// React imports
import { useState } from 'react';

// Library imports
import constants from './CancelBid.constants';
import { Step } from './CancelBid.types';
import useBidData from './hooks/useBidData';
import useCancelBid from './hooks/useCancelBid';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';

// Component imports
import { Wizard } from 'components';
import Details from './components/Details';

type CancelBidContainerProps = {
	bidNonce: string;
	domainId: string;
	onSuccess: () => void;
	onClose: () => void;
};

export const CancelBid = ({
	bidNonce,
	domainId,
	onSuccess,
	onClose,
}: CancelBidContainerProps) => {
	const { bid, bidData, refetch, isLoading } = useBidData(domainId, bidNonce);
	const { cancel, status } = useCancelBid();

	const [currentStep, setCurrentStep] = useState<Step>(Step.LoadingData);
	const [error, setError] = useState<string | undefined>();

	useUpdateEffect(() => {
		if (isLoading) {
			setCurrentStep(Step.LoadingData);
		} else {
			setCurrentStep(Step.Details);
		}
	}, [isLoading]);

	const onFinish = () => {
		onSuccess();
		onClose();
	};

	const onCancelBid = async () => {
		setCurrentStep(Step.Cancelling);
		try {
			await cancel(bid!);
			setCurrentStep(Step.Success);
		} catch (e) {
			setError(e.message);
			setCurrentStep(Step.Confirmation);
		}
	};

	const onBack = () => {
		setError(undefined);
		setCurrentStep(Step.Details);
	};

	const confirmationErrorButtonText = () =>
		error
			? constants.BUTTONS[Step.Confirmation].TERTIARY
			: constants.BUTTONS[Step.Confirmation].PRIMARY;

	const steps = {
		[Step.LoadingData]: (
			<Wizard.Loading message={constants.MESSAGES.TEXT_LOADING} />
		),
		[Step.Details]: bidData ? (
			<Details
				bidData={bidData}
				onClose={onClose}
				onNext={() => setCurrentStep(Step.Confirmation)}
			/>
		) : (
			<Wizard.Confirmation
				message={constants.MESSAGES.TEXT_FAILED_TO_LOAD}
				primaryButtonText={constants.BUTTONS[Step.Details].PRIMARY}
				onClickPrimaryButton={refetch}
				secondaryButtonText={constants.BUTTONS[Step.Details].SECONDARY}
				onClickSecondaryButton={onClose}
			/>
		),
		[Step.Confirmation]: (
			<Wizard.Confirmation
				error={error}
				message={constants.MESSAGES.TEXT_CONFIRM_CANCEL}
				primaryButtonText={confirmationErrorButtonText()}
				onClickPrimaryButton={onCancelBid}
				secondaryButtonText={constants.BUTTONS[Step.Confirmation].SECONDARY}
				onClickSecondaryButton={onBack}
			/>
		),
		[Step.Cancelling]: <Wizard.Loading message={status} />,
		[Step.Success]: (
			<Wizard.Confirmation
				message={constants.MESSAGES.TEXT_SUCCESS}
				primaryButtonText={constants.BUTTONS[Step.Success].PRIMARY}
				onClickPrimaryButton={onFinish}
			/>
		),
	};

	return <Wizard header={constants.LABELS.HEADER}>{steps[currentStep]}</Wizard>;
};

export default CancelBid;
