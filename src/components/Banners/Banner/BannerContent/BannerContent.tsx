//- Component Imports
import { Countdown } from 'components';

//- Container Imports
import { Stage } from 'containers/flows/MintWheels/types';

//- Utils Imports
import { IndustryType, getIndustryTitle, BannerEventType } from '../utils';

//- Constants Imports
import { LOADING_DROP_DATA } from '../constants';

//- Asset Imports
import CribsBanner from '../assets/cribs-banner.gif';
import WheelsBanner from '../assets/wheels-banner.gif';

//- Banner Image Url
export const getBannerImage = (industryType: IndustryType) => {
	if (industryType === IndustryType.CRIBS) {
		return CribsBanner;
	} else if (industryType === IndustryType.WHEELS) {
		return WheelsBanner;
	} else if (industryType === IndustryType.KICKS) {
		// placeholder - gif required
		return 'KicksBanner';
	} else if (industryType === IndustryType.PETS) {
		// placeholder - gif required
		return 'PetsBanner';
	} else if (industryType === IndustryType.CRAFTS) {
		// placeholder - gif required
		return 'CraftsBanner';
	} else {
		return '';
	}
};

//- Image Alts
export const getBannerImageAlt = (industryType: IndustryType) => {
	if (industryType === IndustryType.CRIBS) {
		return 'buildings in motion';
	} else if (industryType === IndustryType.WHEELS) {
		return 'car in motion';
	} else if (industryType === IndustryType.KICKS) {
		return 'shoes in motion';
	} else if (industryType === IndustryType.PETS) {
		return 'pets in motion';
	} else if (industryType === IndustryType.CRAFTS) {
		return 'crafts in motion';
	} else {
		return '';
	}
};

//- Banner Title
export const getBannerTitle = (
	industryType: IndustryType,
	bannerEventType: BannerEventType,
) => {
	if (bannerEventType === BannerEventType.RAFFLE) {
		return `Get Early Access to ${getIndustryTitle(industryType)}`;
	} else if (bannerEventType === BannerEventType.MINT) {
		if (
			industryType === IndustryType.WHEELS ||
			industryType === IndustryType.CRAFTS
		) {
			return 'Get your ride for the Metaverse';
		} else {
			return `Your ${getIndustryTitle(industryType)} for the Metaverse awaits`;
		}
	} else {
		return '';
	}
};

//- Raffle Banner Button Text
export const getRaffleBannerButtonText = (
	hasRaffleStarted: boolean,
	hasRaffleEnded: boolean,
) => {
	if (!hasRaffleStarted) {
		return 'Get Notified';
	} else if (!hasRaffleEnded) {
		return 'Enter Raffle';
	} else {
		return 'Sale Info';
	}
};

//- Mint Banner Button Text
export const getMintBannerButtonText = (
	industyType: IndustryType,
	dropStage?: Stage,
	isDesktopBreakpoint?: boolean,
): string => {
	if (!isDesktopBreakpoint) {
		return 'Learn More';
	}
	if (dropStage === Stage.Public || dropStage === Stage.Whitelist) {
		return 'Mint Now';
	}
	if (dropStage === Stage.Sold) {
		return `See ${industyType}`;
	}

	return 'Learn More';
};

//- Total Items Remaining Label
const totalLabel = (itemsMinted: number, totalItems: number) => (
	<span>
		<b>{totalItems - itemsMinted} Remaining</b>
	</span>
);

//- Raffle Event Message
export const getRaffleBannerLabel = (
	industryType: IndustryType,
	hasRaffleEnded: boolean,
	hasRaffleStarted: boolean,
	saleStartTime: number,
	raffleEndTime: number,
	raffleStartTime: number,
	onFinishSaleStartCountdown: () => void,
	onFinishRaffleEndCountdown: () => void,
	onFinishRaffleStartCountdown: () => void,
): React.ReactNode => {
	if (hasRaffleEnded) {
		return (
			<>
				{`Wilder ${getIndustryTitle(industryType)} sale starting in`}{' '}
				<b>
					{saleStartTime && (
						<Countdown
							to={saleStartTime}
							onFinish={onFinishSaleStartCountdown}
						/>
					)}
				</b>
			</>
		);
	} else if (hasRaffleStarted) {
		return (
			<>
				{`Join the ${getIndustryTitle(
					industryType,
				)} whitelist raffle. Raffle closes in`}{' '}
				<b>
					{raffleEndTime && (
						<Countdown
							to={raffleEndTime}
							onFinish={onFinishRaffleEndCountdown}
						/>
					)}
				</b>
			</>
		);
	} else {
		return (
			<>
				{`Get notified about the ${getIndustryTitle(
					industryType,
				)} raffle - starting in`}{' '}
				<b>
					{raffleStartTime && (
						<Countdown
							to={raffleStartTime}
							onFinish={onFinishRaffleStartCountdown}
						/>
					)}
				</b>
			</>
		);
	}
};

//- Mint Event Message
export const getMintBannerLabel = (
	industryType: IndustryType,
	dropStage?: Stage,
	itemsMinted?: number,
	totalItems?: number,
	countdownDate?: number,
	onFinish?: () => void,
	isFinished?: boolean,
	isSaleHalted?: boolean,
): React.ReactNode => {
	if (isSaleHalted) {
		return (
			<>
				<span>
					{`Wilder ${getIndustryTitle(
						industryType,
					)} sale has been temporarily paused to ensure a fair sale.`}
				</span>
				<span style={{ display: 'block', marginTop: 4 }}>
					Join our{' '}
					<b>
						<a
							href={'https://discord.gg/mb9fcFey8a'}
							target={'_blank'}
							rel={'noreferrer'}
						>
							Discord
						</a>
					</b>{' '}
					for more details.
				</span>
			</>
		);
	}
	if (dropStage === Stage.Upcoming) {
		return (
			<>
				{`${getIndustryTitle(
					industryType,
				)} whitelist release starting - waiting for contract to begin`}
			</>
		);
	}
	if (dropStage === Stage.Whitelist) {
		if (isFinished) {
			<>{`${getIndustryTitle(
				industryType,
			)} public release starting - you may need to refresh`}</>;
		} else {
			return (
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<span>
						{`${getIndustryTitle(
							industryType,
						)} now available for whitelisted supporters`}{' '}
						{totalLabel(itemsMinted!, totalItems!)}
					</span>
					<span style={{ marginTop: 4 }}>
						Available to public in{' '}
						{countdownDate && (
							<Countdown to={countdownDate} onFinish={onFinish} />
						)}
					</span>
				</div>
			);
		}
	}
	if (dropStage === Stage.Whitelist) {
		let timer;
		if (countdownDate && !isFinished) {
			timer = (
				<span style={{ display: 'inline-block', marginTop: 6 }}>
					Available to everyone in{' '}
					{countdownDate && (
						<Countdown to={countdownDate} onFinish={onFinish} />
					)}
				</span>
			);
		}
		if (countdownDate && isFinished) {
			timer = (
				<span style={{ display: 'inline-block', marginTop: 4 }}>
					{`Wilder ${getIndustryTitle(
						industryType,
					)} public release starting now - waiting for contract to begin`}
				</span>
			);
		}

		return (
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<span>
					{`Wilder ${getIndustryTitle(
						industryType,
					)} now available for whitelisted supporters`}{' '}
					{totalLabel(itemsMinted!, totalItems!)}
				</span>
				{timer}
			</div>
		);
	}
	if (dropStage === Stage.Public) {
		return (
			<>
				{`Minting is now open to everyone, act fast to secure your Wilder ${getIndustryTitle(
					industryType,
				)}!`}{' '}
				{totalLabel(itemsMinted!, totalItems!)}
			</>
		);
	}
	if (dropStage === Stage.Sold) {
		return <>{`All ${totalItems} ${industryType} have been minted`}</>;
	}
	return <>{LOADING_DROP_DATA}</>;
};
