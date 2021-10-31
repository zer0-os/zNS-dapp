import { Stage } from './types';
import { ArrowLink, Countdown } from 'components';
import { saleHaltAmount, EthPerWheel } from './helpers';

const totalLabel = (wheelsMinted: number, wheelsTotal: number) => (
	<span>
		<b>{wheelsTotal - wheelsMinted} Remaining</b>
	</span>
);

export const getBannerButtonText = (
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
		return 'See Wheels';
	}

	return 'Learn More';
};

export const getBannerLabel = (
	dropStage?: Stage,
	wheelsMinted?: number,
	wheelsTotal?: number,
	countdownDate?: number,
	onFinish?: () => void,
	isFinished?: boolean,
): React.ReactNode => {
	if (dropStage === Stage.Upcoming) {
		if (isFinished) {
			return (
				<>Wilder Wheels whitelist release starting - you may need to refresh</>
			);
		} else {
			return (
				<>
					Wilder Wheels available to whitelisted supporters in{' '}
					{countdownDate && (
						<Countdown to={countdownDate} onFinish={onFinish} />
					)}
				</>
			);
		}
	}
	if (dropStage === Stage.Whitelist) {
		if (isFinished) {
			<>Wilder Wheels public release starting - you may need to refresh</>;
		} else {
			return (
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<span>
						Wilder Wheels now available for whitelisted supporters{' '}
						{totalLabel(wheelsMinted!, wheelsTotal!)}
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
					Public release starting now
				</span>
			);
		}

		return (
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<span>
					Wilder Wheels now available for whitelisted supporters{' '}
					{totalLabel(wheelsMinted!, wheelsTotal!)}
				</span>
				{timer}
			</div>
		);
	}
	if (dropStage === Stage.Public) {
		return (
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<span>
					Minting is open to everyone!{' '}
					<b>{(saleHaltAmount - wheelsMinted! || 0).toLocaleString()}</b>{' '}
					remaining at {EthPerWheel} ETH.
				</span>
				<span style={{ marginTop: '4px' }}>
					Price jumps to {2 * EthPerWheel} ETH thereafter.{' '}
					<ArrowLink
						href={'https://zine.wilderworld.com/the-wilder-way-wheels-update/'}
						style={{ fontWeight: 700 }}
					>
						Learn more
					</ArrowLink>
				</span>
			</div>
		);
	}
	if (dropStage === Stage.Sold) {
		return <>All {wheelsTotal} Wheels have been minted</>;
	}
	return <>Loading drop data...</>;
};
