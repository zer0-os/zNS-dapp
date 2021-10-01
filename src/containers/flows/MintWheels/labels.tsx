import { Stage } from './types';

const totalLabel = (wheelsMinted: number, wheelsTotal: number) => (
	<b>{wheelsTotal - wheelsMinted} Remaining</b>
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
): React.ReactNode => {
	if (dropStage === Stage.Upcoming) {
		return (
			<>
				Wilder Wheels available to whitelisted supporters on 30th September at
				11.59pm PST
			</>
		);
	}
	if (dropStage === Stage.Whitelist) {
		return (
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<span>
					Wilder Wheels now available for whitelisted supporters{' '}
					{totalLabel(wheelsMinted!, wheelsTotal!)}
				</span>
				<span style={{ display: 'inline-block', marginTop: 4 }}>
					Available to everyone on 1st October 11:59am PST
				</span>
			</div>
		);
	}
	if (dropStage === Stage.Public) {
		return (
			<>
				Minting is now open to everyone, act fast to secure your Wheels!{' '}
				{totalLabel(wheelsMinted!, wheelsTotal!)}
			</>
		);
	}
	if (dropStage === Stage.Sold) {
		return <>All {wheelsTotal} Wheels have been minted</>;
	}
	return <>Loading drop data...</>;
};
