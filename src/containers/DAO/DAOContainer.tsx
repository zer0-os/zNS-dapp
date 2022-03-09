import React, { useEffect, useState } from 'react';

// Style Imports
import styles from '../staking/StakingContainer/StakingContainer.module.scss';
// TODO: Generalize styles for both pages
import classNames from 'classnames/bind';
import {
	useLocation,
	Link,
	Redirect,
	Route,
	Switch,
	useRouteMatch,
} from 'react-router-dom';
import { ROUTES } from 'constants/routes';
import { useNavbar } from 'lib/hooks/useNavbar';
import { useDidMount } from 'lib/hooks/useDidMount';

type StakingContainerProps = {
	className?: string;
	style?: React.CSSProperties;
};

const cx = classNames.bind(styles);

const DAOContainer: React.FC<StakingContainerProps> = ({
	className,
	style,
}) => {
	const { pathname } = useLocation();
	const { path } = useRouteMatch();

	const { setNavbarTitle } = useNavbar();

	useDidMount(() => {
		setNavbarTitle(undefined);
	});

	return (
		<>
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
							className={cx({
								Active: pathname.includes(ROUTES.ZDAO_ASSETS),
							})}
							to={path + ROUTES.ZDAO_ASSETS}
						>
							Assets
						</Link>
						<Link
							className={cx({
								Active: pathname.includes(ROUTES.ZDAO_TRANSACTIONS),
							})}
							to={path + ROUTES.ZDAO_TRANSACTIONS}
						>
							Transactions
						</Link>
					</nav>
					{/* <Route
						exact
						path={path + ROUTES.STAKING_DEPOSITS}
						component={Deposits}
					/>
					<Route
						exact
						path={path + ROUTES.STAKING_POOLS}
						component={StakePools}
					/> */}
					<Route exact path={path}>
						<Redirect to={path + ROUTES.ZDAO_ASSETS} />
					</Route>
				</div>
			</Switch>
		</>
	);
};

export default DAOContainer;
