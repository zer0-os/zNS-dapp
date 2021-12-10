import React, { useState } from 'react';

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

	return (
		<main
			className={cx(
				className,
				'main',
				'background-primary',
				'border-primary',
				'border-rounded',
			)}
			style={{ ...style, marginTop: 32 }}
		>
			<TabBar tabs={['Pools', 'My Dash']} onSelect={setSelectedTab} />
			<StakePools />
		</main>
	);
};

export default StakingContainer;
