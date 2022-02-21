import { Wizard } from 'components';
import { ethers } from 'ethers';
import React from 'react';
import Details from './Steps/Details';

export enum Step {
	ApproveZAuction,
	ApproveZAuctionWaiting,
	ApproveZAuctionProcessing,
	Details,
	WaitingForWalletConfirmation,
	Buying,
	Success,
}

export type Data = {
	assetUrl: string;
	creator: string;
	buyNowPrice: ethers.BigNumber;
	domain: string;
	highestBid: number;
	id: string;
	owner: string;
	title: string;
	balanceWild: ethers.BigNumber;
	userWalletAddress: string;
};

type BuyNowProps = {
	data?: Data;
	error?: string;
	isLoadingData: boolean;
	onNext: () => void;
	onCancel: () => void;
	step: Step;
	wildPriceUsd: number;
};

const getSubHeader = (step: Step) => {
	if (step === Step.Success) {
		return 'You have succesfully purchased the following NFT.';
	}
	if (step === Step.Details || step === Step.WaitingForWalletConfirmation) {
		return 'Please review the information and the art to make sure you are purchasing the right NFT.';
	}
	return undefined;
};

const WrapWizard = (child: React.ReactNode) => (
	<Wizard header="Buy Now">{child}</Wizard>
);

const BuyNow = ({
	data,
	error,
	isLoadingData,
	onNext,
	onCancel,
	step,
	wildPriceUsd,
}: BuyNowProps) => {
	if (step === Step.ApproveZAuction) {
		return WrapWizard(
			<Wizard.Confirmation
				message={
					'Before you can buy this domain, your wallet needs to approve zAuction. This is a one-off transaction costing gas.'
				}
				primaryButtonText={'Continue'}
				onClickSecondaryButton={onCancel}
				onClickPrimaryButton={onNext}
			/>,
		);
	}

	if (step === Step.ApproveZAuctionWaiting) {
		return WrapWizard(
			<Wizard.Loading message="Waiting for approval from your wallet..." />,
		);
	}

	if (step === Step.ApproveZAuctionProcessing) {
		return WrapWizard(
			<Wizard.Loading message="Approving zAuction. This may take up to 20 mins... Please do not close this window or refresh the page." />,
		);
	}

	if (isLoadingData) {
		return WrapWizard(<Wizard.Loading message="Loading data..." />);
	} else if (!data) {
		return WrapWizard(
			<Wizard.Confirmation
				message={'Failed to load data'}
				primaryButtonText={'Cancel'}
				onClickPrimaryButton={onCancel}
			/>,
		);
	} else if (
		data.userWalletAddress.toLowerCase() === data.owner.toLowerCase()
	) {
		return WrapWizard(
			<Wizard.Confirmation
				message={'You already own this domain'}
				primaryButtonText={'Cancel'}
				onClickPrimaryButton={onCancel}
			/>,
		);
	} else if (data.buyNowPrice.lte(0)) {
		return WrapWizard(
			<Wizard.Confirmation
				message={'This domain does not have a Buy Now price'}
				primaryButtonText={'Cancel'}
				onClickPrimaryButton={onCancel}
			/>,
		);
	}

	const steps = [];

	steps[Step.Details] =
		steps[Step.WaitingForWalletConfirmation] =
		steps[Step.Success] =
			(
				<Details
					error={error}
					onNext={onNext}
					data={data}
					wildPriceUsd={wildPriceUsd}
					onCancel={onCancel}
					isWaitingForWalletConfirmation={
						step === Step.WaitingForWalletConfirmation
					}
					didSucceed={step === Step.Success}
				/>
			);

	steps[Step.Buying] = (
		<Wizard.Loading message="Buying NFT. This may take up to 20 mins... Please do not close this window or refresh the page." />
	);

	return (
		<Wizard
			header={step === Step.Success ? 'Congratulations!' : 'Buy Now'}
			subHeader={getSubHeader(step)}
		>
			{steps[step]}
		</Wizard>
	);
};

export default BuyNow;
