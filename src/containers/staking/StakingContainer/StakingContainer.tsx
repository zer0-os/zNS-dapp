import React, { useEffect, useMemo, useState } from 'react';

import { Overlay, TabBar } from 'components';

import {
	Deposits,
	StakeFlow,
	StakePool,
	StakePools,
	ClaimFlow,
} from 'containers/staking';

import { useStaking } from 'lib/providers/staking/StakingProvider';

// Style Imports
import styles from './StakingContainer.module.scss';
import classNames from 'classnames/bind';
import {
	useLocation,
	BrowserRouter,
	Link,
	Redirect,
	Route,
	Switch,
} from 'react-router-dom';

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

	const { selectedPool, deselectPool, selectedDeposit, deselectDeposit } =
		useStaking();
	const { pathname } = useLocation();

	return (
		<>
			<Overlay
				centered
				open={selectedPool !== undefined}
				onClose={deselectPool}
			>
				{selectedPool && <StakeFlow onClose={deselectPool} />}
			</Overlay>
			<Overlay
				centered
				open={selectedDeposit !== undefined}
				onClose={deselectDeposit}
			>
				{selectedDeposit && <ClaimFlow onClose={deselectDeposit} />}
			</Overlay>
			<Switch>
				<Route
					path="/pools/:pool"
					component={(params: any) => (
						<StakePool domain={'/pools/' + params.match.params.pool} />
					)}
				/>
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
					<nav className={styles.Links}>
						<Link
							className={cx({ Active: pathname.startsWith('/pools') })}
							to={'/pools'}
						>
							Pools
						</Link>
						<Link
							className={cx({ Active: pathname.startsWith('/deposits') })}
							to={'/deposits'}
						>
							My Deposits
						</Link>
					</nav>
					<Route exact path="/deposits" component={Deposits} />
					<Route exact path="/pools" component={StakePools} />
					<Redirect to={'/pools'} />
				</div>
				<Redirect to={'/pools'} />
			</Switch>
		</>
	);
};

export default StakingContainer;
