import { Wizard } from 'components';
import DomainStep from './Steps/DomainStep';

export enum Step {
	CheckingZAuctionApproval,
	LoadingDomainData,
	ApproveZAuction,
	ApprovingZAuction,
	SetBuyNow,
	WaitingForWallet,
	SettingBuyNow,
	Success,
}

export type DomainData = {
	id: string;
	title: string;
	domain: string;
	owner: string;
	assetUrl: string;
	creator: string;
	highestBid: number;
	currentBuyNowPrice?: number;
};

type SetBuyNowProps = {
	domainData?: DomainData;
	error?: string;
	isLoadingDomainData: boolean;
	approveZAuction: () => void;
	setBuyNowPrice: (buyNowPrice: number) => void;
	onCancel: () => void;
	onNext: () => void;
	step: Step;
	wildPriceUsd: number;
};

const LoadingDomainData = () => {
	return (
		<Wizard header="Set Buy Now">
			<Wizard.Loading message="Loading domain data..." />
		</Wizard>
	);
};

const FailedToLoadDomainData = () => {
	return (
		<Wizard header="Set Buy Now">
			<Wizard.Confirmation
				message={'Failed to load domain data'}
				onClickPrimaryButton={() => console.log('continue')}
				onClickSecondaryButton={() => console.log('cancel')}
			/>
		</Wizard>
	);
};

const SetBuyNow = ({
	domainData: domain,
	error,
	isLoadingDomainData,
	approveZAuction,
	setBuyNowPrice,
	onNext,
	step,
	wildPriceUsd,
}: SetBuyNowProps) => {
	if (isLoadingDomainData) {
		return LoadingDomainData();
	} else if (!domain) {
		return FailedToLoadDomainData();
	}

	const steps = [];
	steps[Step.CheckingZAuctionApproval] = (
		<Wizard.Loading message="Checking status of zAuction approval..." />
	);
	steps[Step.ApproveZAuction] = (
		<Wizard.Confirmation
			message={
				'Before you can set a buy now, your wallet needs to approve zAuction. This is a one-off transaction costing gas.'
			}
			onClickPrimaryButton={approveZAuction}
			onClickSecondaryButton={() => console.log('cancel')}
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
	steps[Step.SetBuyNow] = (
		<DomainStep
			onNext={(buyNowPrice: number) => setBuyNowPrice(buyNowPrice)}
			domainData={domain}
			wildPriceUsd={wildPriceUsd}
		/>
	);

	return <Wizard header="Set Buy Now">{steps[step]}</Wizard>;
};

export default SetBuyNow;
