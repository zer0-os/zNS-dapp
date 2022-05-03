import { Wizard } from 'components';
import { ethers } from 'ethers';
import DomainStep from './Steps/DomainStep';

export enum Step {
	CheckingZAuctionApproval,
	ApproveZAuction,
	WaitingForWallet,
	ApprovingZAuction,
	SetBuyNow,
	WaitingForBuyNowConfirmation,
	SettingBuyNow,
	Success,
}

export type DomainData = {
	assetUrl: string;
	creator: string;
	currentBuyNowPrice?: ethers.BigNumber;
	domain: string;
	highestBid: number;
	id: string;
	owner: string;
	title: string;
};

type SetBuyNowProps = {
	approveZAuction: () => void;
	domainData?: DomainData;
	error?: string;
	isLoadingDomainData: boolean;
	onCancel: () => void;
	setBuyNowPrice: (buyNowPrice?: number) => void;
	step: Step;
	wildPriceUsd: number;
	account?: string;
};

const SetBuyNow = ({
	domainData: domain,
	error,
	isLoadingDomainData,
	approveZAuction,
	setBuyNowPrice,
	onCancel,
	step,
	wildPriceUsd,
	account,
}: SetBuyNowProps) => {
	const editText = account !== domain?.owner ? 'selecting' : 'purchasing';
	const getTitle = () =>
		domain?.currentBuyNowPrice?.gt(0) ? 'Edit Buy Now' : 'Set Buy Now';
	const wizardHeader = getTitle();
	if (isLoadingDomainData) {
		return (
			<Wizard header={wizardHeader}>
				<Wizard.Loading message="Loading domain data..." />
			</Wizard>
		);
	} else if (!domain) {
		return (
			<Wizard header={wizardHeader}>
				<Wizard.Confirmation
					message={'Failed to load domain data'}
					primaryButtonText={'Cancel'}
					onClickPrimaryButton={onCancel}
				/>
			</Wizard>
		);
	}
	const steps = [];
	steps[Step.CheckingZAuctionApproval] = (
		<Wizard.Loading message="Checking status of zAuction approval..." />
	);
	steps[Step.ApproveZAuction] = (
		<Wizard.Confirmation
			error={error}
			message={
				'Before you can set a buy now, your wallet needs to approve zAuction. This is a one-off transaction costing gas.'
			}
			onClickPrimaryButton={approveZAuction}
			onClickSecondaryButton={onCancel}
		/>
	);
	steps[Step.WaitingForWallet] = (
		<Wizard.Loading message="Waiting for approval from your wallet..." />
	);
	steps[Step.ApprovingZAuction] = (
		<Wizard.Loading message="Approving zAuction. This may take up to 20 mins... Please do not close this window or refresh the page." />
	);
	steps[Step.SettingBuyNow] = (
		<Wizard.Loading message="Setting buy now. This may take up to 20 mins... Please do not close this window or refresh the page." />
	);
	steps[Step.SetBuyNow] =
		steps[Step.WaitingForBuyNowConfirmation] =
		steps[Step.Success] =
			(
				<DomainStep
					error={error}
					onNext={(buyNowPrice?: number) => setBuyNowPrice(buyNowPrice)}
					domainData={domain}
					wildPriceUsd={wildPriceUsd}
					isWaitingForWalletConfirmation={
						step === Step.WaitingForBuyNowConfirmation
					}
					didSucceed={step === Step.Success}
					onCancel={onCancel}
				/>
			);

	return (
		<Wizard
			header={wizardHeader}
			subHeader={`Please review the information and the art to make sure you are ${editText} the right NFT.`}
		>
			{steps[step]}
		</Wizard>
	);
};

export default SetBuyNow;
