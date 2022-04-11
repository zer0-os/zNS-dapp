import { Stage } from './types';
import { Countdown } from 'components';

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
		return 'Mint Now';
	}
	if (dropStage === Stage.Sold) {
		return 'Beasts Secondary Market';
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
		return <>Presale Mint Period Coming Soon - waiting for contract to begin</>;
	}
	if (dropStage === Stage.Whitelist) {
		if (isFinished) {
			<>Wilder Beasts public release starting - you may need to refresh</>;
		} else {
			return (
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<span>
						Presale Minting is now Open!{' '}
						{totalLabel(wheelsMinted!, wheelsTotal!)}
					</span>
					{/* <span style={{ marginTop: 4 }}>
						Available to public in{' '}
						{countdownDate && (
							<Countdown to={countdownDate} onFinish={onFinish} />
						)}
					</span> */}
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
					Public release starting now - waiting for contract to begin
				</span>
			);
		}

		return (
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<span>
					Presale Minting is now Open! {totalLabel(wheelsMinted!, wheelsTotal!)}
				</span>
				{timer}
			</div>
		);
	}
	if (dropStage === Stage.Public) {
		if (Math.max(wheelsTotal! - wheelsMinted!, 0) !== 0) {
			return (
				<>
					The beasts sale is finished.{' '}
					{Math.max(wheelsTotal! - wheelsMinted!, 0)} remaining beasts have been
					transferred to the Wilder DAO.
				</>
			);
		}
		return (
			<>
				Minting is now open to everyone, act fast to secure your Beasts!{' '}
				{totalLabel(wheelsMinted!, wheelsTotal!)}
			</>
		);
	}

	if (dropStage === Stage.Sold) {
		return <>Wolves Sale is Complete</>;
		// return <>Air Wild Season One is sold out!</>;
	}

	return <>Loading drop data...</>;
};
