import React, { useMemo, useState } from 'react';

import { Overlay, TabBar } from 'components';

import { Deposits, StakeFlow, StakePool, StakePools } from 'containers/staking';

import { useStaking } from 'lib/providers/staking/StakingProvider';

// Style Imports
import styles from './StakingContainer.module.scss';
import classNames from 'classnames/bind';

type StakingContainerProps = {
	className?: string;
	style?: React.CSSProperties;
};

const cx = classNames.bind(styles);

const StakingContainer: React.FC<StakingContainerProps> = ({
	className,
	style,
}) => {
	// Things we need to handle here:
	// - Grabbing all pool data
	// - Grabbing all user data (deposits, WILD balance, rewards, etc
	// - Opening StakeFlow modal for a specified pool

	const { stakingOn, closeStakingModal } = useStaking();

	const [selectedTab, setSelectedTab] = useState<string>('Pools');

	const tab = useMemo(() => {
		if (selectedTab === 'Pools') {
			return <StakePools />;
		} else {
			return <Deposits />;
		}
	}, [selectedTab]);

	return (
		<>
			<Overlay
				centered
				open={stakingOn !== undefined}
				onClose={closeStakingModal}
			>
				<StakeFlow onClose={closeStakingModal} />
			</Overlay>
			<StakePool domain={'stakewild'} />
			<div
				className={cx(
					className,
					styles.Container,
					'main',
					'background-primary',
					'border-primary',
					'border-rounded',
				)}
				style={style}
			>
				<TabBar
					tabs={['Pools', 'My Deposits']}
					tabStyle={{ fontSize: 24 }}
					onSelect={setSelectedTab}
				/>
				{tab}
			</div>
		</>
	);
};

export default StakingContainer;
