import { Wizard } from 'components';
import { ethers } from 'ethers';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { useState } from 'react';
import constants from './CancelBid.constants';
import { Step } from './CancelBid.types';
import useBidData from './hooks/useBidData';
import useCancelBid from './hooks/useCancelBid';

type CancelBidContainerProps = {
	auctionId: string;
	domainId: string;
	onSuccess: () => void;
	onClose: () => void;
};

export const CancelBid = ({
	auctionId,
	domainId,
	onSuccess,
	onClose,
}: CancelBidContainerProps) => {
	const { bid, bidData, refetch, isLoading } = useBidData(domainId, auctionId);
	const { cancel } = useCancelBid();

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

	const steps = [];
	steps[Step.LoadingData] = <Wizard.Loading message={constants.TEXT_LOADING} />;
	steps[Step.Details] = (
		<div>
			{bidData ? (
				<>
					<Wizard.NFTDetails
						assetUrl={bidData.assetUrl}
						creator={bidData.creator}
						domain={bidData.domainName}
						title={bidData.title}
						otherDetails={[
							{
								name: 'Highest Bid',
								value:
									ethers.utils.formatEther(bidData.highestBid).toString() +
									' WILD',
							},
							{
								name: 'Your Bid',
								value:
									ethers.utils.formatEther(bidData.yourBid).toString() +
									' WILD',
							},
						]}
					/>
					<Wizard.Buttons
						primaryButtonText="Confirm"
						onClickPrimaryButton={() => setCurrentStep(Step.Confirmation)}
						onClickSecondaryButton={onClose}
					/>
				</>
			) : (
				<Wizard.Confirmation
					message={constants.TEXT_FAILED_TO_LOAD}
					primaryButtonText="Retry"
					onClickPrimaryButton={refetch}
					secondaryButtonText="Close"
					onClickSecondaryButton={onClose}
				/>
			)}
		</div>
	);
	steps[Step.Confirmation] = (
		<Wizard.Confirmation
			error={error}
			message={constants.TEXT_CONFIRM_CANCEL}
			primaryButtonText={'Cancel Bid'}
			onClickPrimaryButton={onCancelBid}
			secondaryButtonText={'Back'}
			onClickSecondaryButton={onBack}
		/>
	);
	steps[Step.Cancelling] = (
		<Wizard.Loading message={constants.TEXT_CANCELLING_BID} />
	);
	steps[Step.Success] = (
		<Wizard.Confirmation
			message={constants.TEXT_SUCCESS}
			primaryButtonText={'Finish'}
			onClickPrimaryButton={onFinish}
		/>
	);

	return <Wizard header={'Cancel Bid'}>{steps[currentStep]}</Wizard>;
};

export default CancelBid;
