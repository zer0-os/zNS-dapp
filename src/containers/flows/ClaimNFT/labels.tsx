import { Countdown } from 'components';
import { Stage } from '../MintDropNFT/types';

const totalLabel = (wheelsMinted: number, wheelsTotal: number) => (
	<span>
		<b>{Math.max(wheelsTotal - wheelsMinted, 0)} Remaining</b>
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
		return 'Claim Now';
	}
	if (dropStage === Stage.Sold || dropStage === Stage.Ended) {
		return 'See Moto';
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
		return <>Wilder Moto Claim starting now - waiting for contract to begin</>;
	}
	if (dropStage === Stage.Whitelist) {
		if (countdownDate && isFinished) {
			return (
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<span>
						Wilder Moto Claim starting now - waiting for contract to begin
					</span>
				</div>
			);
		}
		return (
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<span>
					Wilder Moto Claim is Live! Ending in{' '}
					{countdownDate && (
						<Countdown to={countdownDate} onFinish={onFinish} />
					)}{' '}
					({totalLabel(wheelsMinted!, wheelsTotal!)})
				</span>
			</div>
		);
	}
	// if (dropStage === Stage.Public) {
	// 	return (
	// 		<>
	// 			AIR WILD Season Two Community Minting is now Open!{' '}
	// 			{totalLabel(wheelsMinted!, wheelsTotal!)}
	// 		</>
	// 	);
	// }

	if (dropStage === Stage.Sold || dropStage === Stage.Ended) {
		return <>The Claim Period has Concluded</>;
	}

	return <>Loading drop data...</>;
};
