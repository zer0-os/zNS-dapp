//- Component Imports
import { Countdown } from 'components';

//- Container Imports
import { Stage } from 'containers/flows/MintWheels/types';

//- Utils Imports
import { IndustryType, getBannerTitle } from '../utils';

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
				{`${getBannerTitle(industryType)} sale starting in`}{' '}
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
				{`Join the ${getBannerTitle(
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
				{`Get notified about the ${getBannerTitle(
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
					{`${getBannerTitle(
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
				{`${getBannerTitle(
					industryType,
				)} whitelist release starting - waiting for contract to begin`}
			</>
		);
	}
	if (dropStage === Stage.Whitelist) {
		if (isFinished) {
			<>{`${getBannerTitle(
				industryType,
			)} public release starting - you may need to refresh`}</>;
		} else {
			return (
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<span>
						{`${getBannerTitle(
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
					{`${getBannerTitle(
						industryType,
					)} public release starting now - waiting for contract to begin`}
				</span>
			);
		}

		return (
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<span>
					{`${getBannerTitle(
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
				{`Minting is now open to everyone, act fast to secure your ${getBannerTitle(
					industryType,
				)}!`}{' '}
				{totalLabel(itemsMinted!, totalItems!)}
			</>
		);
	}
	if (dropStage === Stage.Sold) {
		return <>{`All ${totalItems} ${industryType} have been minted`}</>;
	}
	return <>Loading drop data...</>;
};
