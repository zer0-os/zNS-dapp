import React, { useEffect } from 'react';

import { Overlay } from 'components';

import {
	Deposits,
	StakeFlow,
	StakePool,
	StakePools,
	ClaimFlow,
} from 'containers/staking';

// Style Imports
import styles from './StakingContainer.module.scss';
import classNames from 'classnames/bind';
import { useLocation, Link, Redirect, Route, Switch } from 'react-router-dom';
import { useStakingPoolSelector } from 'lib/providers/staking/PoolSelectProvider';
import { useNav } from 'lib/providers/NavProvider';

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

	const poolSelection = useStakingPoolSelector();

	const { pathname } = useLocation();
	const { setLocation } = useNav();

	useEffect(() => {
		switch (pathname) {
			case '/pools':
				setLocation('Staking - Pools');
				break;
			case '/deposits':
				setLocation('Staking - My Deposits');
				break;
			default:
				setLocation(undefined);
				break;
		}
	}, [pathname]);

	return (
		<>
			<Overlay
				centered
				open={poolSelection.stakePool !== undefined}
				onClose={() => {
					poolSelection.selectStakePool(undefined);
				}}
			>
				{poolSelection.stakePool && (
					<StakeFlow onClose={() => poolSelection.selectStakePool(undefined)} />
				)}
			</Overlay>
			<Overlay
				centered
				open={poolSelection.unstaking !== undefined}
				onClose={() => {
					poolSelection.unstake(undefined);
				}}
			>
				{poolSelection.unstaking && (
					<StakeFlow unstake onClose={() => poolSelection.unstake(undefined)} />
				)}
			</Overlay>
			<Overlay
				centered
				open={poolSelection.claiming !== undefined}
				onClose={() => poolSelection.claim(undefined)}
			>
				{poolSelection.claiming && (
					<ClaimFlow onClose={() => poolSelection.claim(undefined)} />
				)}
			</Overlay>
			<Switch>
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
