import React, { useEffect, useState } from 'react';

import { Overlay } from 'components';

import { Deposits, StakeFlow, StakePools, ClaimFlow } from 'containers/staking';

// Style Imports
import styles from './StakingContainer.module.scss';
import classNames from 'classnames/bind';
import {
	useLocation,
	Link,
	Redirect,
	Route,
	Switch,
	useRouteMatch,
} from 'react-router-dom';
import { useStakingPoolSelector } from 'lib/providers/staking/PoolSelectProvider';
import { useStakingUserData } from 'lib/providers/staking/StakingUserDataProvider';
import { useStaking } from 'lib/providers/staking/StakingSDKProvider';
import { useWeb3React } from '@web3-react/core';
import { useNavbar } from 'lib/hooks/useNavbar';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { ROUTES } from 'constants/routes';

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

	const { account } = useWeb3React();
	const { refetch: refetchPoolData } = useStaking();
	const poolSelection = useStakingPoolSelector();
	const { refetch: refetchUserData } = useStakingUserData();

	const { pathname } = useLocation();
	// const { setLocation } = useNav();
	const { path } = useRouteMatch();

	// useEffect(() => {
	// 	console.log(path);
	// }, [path]);

	const [isBelowBreakpoint, setIsBelowBreakpoint] = useState<boolean>();

	const handleResize = () => {
		setIsBelowBreakpoint(window.innerWidth <= 701);
	};

	const refetchAll = () => {
		refetchPoolData();
		refetchUserData();
	};

	const { setNavbarTitle } = useNavbar();

	useUpdateEffect(() => {
		switch (pathname.replace(ROUTES.STAKING, '')) {
			case ROUTES.STAKING_POOLS:
				setNavbarTitle('Staking - Pools');
				break;
			case ROUTES.STAKING_DEPOSITS:
				setNavbarTitle('Staking - My Deposits');
				break;
			default:
				setNavbarTitle(undefined);
				break;
		}
	}, [pathname]);

	useEffect(() => {
		window.addEventListener('resize', handleResize);
		handleResize();
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	useUpdateEffect(() => {
		poolSelection.claim(undefined);
	}, [account]);

	if (isBelowBreakpoint) {
		return (
			<div
				style={{
					position: 'fixed',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -100%)',
					width: '100%',
					padding: 16,
					textAlign: 'center',
					fontWeight: 700,
				}}
			>
				Staking is currently only available on desktop
			</div>
		);
	}

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
					<StakeFlow
						onSuccess={refetchAll}
						onClose={() => poolSelection.selectStakePool(undefined)}
					/>
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
					<StakeFlow
						onSuccess={refetchAll}
						unstake
						onClose={() => poolSelection.unstake(undefined)}
					/>
				)}
			</Overlay>
			<Overlay
				centered
				open={poolSelection.claiming !== undefined}
				onClose={() => poolSelection.claim(undefined)}
			>
				{poolSelection.claiming && (
					<ClaimFlow
						onSuccess={refetchAll}
						onClose={() => poolSelection.claim(undefined)}
					/>
				)}
			</Overlay>
			<Switch>
				<div
					className={cx(
						className,
						styles.Container,
						'main',
						'background-primary',
					)}
					style={style}
				>
					<nav className={styles.Links}>
						<Link
							className={cx({
								Active: pathname.includes(ROUTES.STAKING_POOLS),
							})}
							to={path + ROUTES.STAKING_POOLS}
						>
							Pools
						</Link>
						<Link
							className={cx({
								Active: pathname.includes(ROUTES.STAKING_DEPOSITS),
							})}
							to={path + ROUTES.STAKING_DEPOSITS}
						>
							My Deposits
						</Link>
					</nav>
					<Route
						exact
						path={path + ROUTES.STAKING_DEPOSITS}
						component={Deposits}
					/>
					<Route
						exact
						path={path + ROUTES.STAKING_POOLS}
						component={StakePools}
					/>
					<Route exact path={path}>
						<Redirect to={path + ROUTES.STAKING_POOLS} />
					</Route>
				</div>
			</Switch>
		</>
	);
};

export default StakingContainer;
