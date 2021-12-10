import React, { useMemo, useState } from 'react';

import { TabBar } from 'components';

import { StakePools } from 'containers/staking';

// Style Imports
import styles from './StakingContainer.module.css';
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
	const [selectedTab, setSelectedTab] = useState<string>('Pools');

	const tab = useMemo(() => {
		if (selectedTab === 'Pools') {
			return <StakePools />;
		} else {
			return 'Dashboard';
		}
	}, [selectedTab]);

	return (
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
			<TabBar tabs={['Pools', 'My Deposits']} onSelect={setSelectedTab} />
			{tab}
		</div>
	);
};

export default StakingContainer;
