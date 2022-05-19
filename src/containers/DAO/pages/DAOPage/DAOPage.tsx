// React
import React from 'react';
import {
	Link,
	Redirect,
	Route,
	Switch,
	useLocation,
	useRouteMatch,
} from 'react-router-dom';

// Components
import Assets from './Assets/Assets';
import Transactions from './Transactions/Transactions';
import { Proposals, ProposalDetail } from './Proposals';
import { LoadingIndicator, StatsWidget } from 'components';

// Hooks
import { useNavbar } from 'lib/hooks/useNavbar';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { useCurrentDao } from 'lib/dao/providers/CurrentDaoProvider';
import useTransactions from './hooks/useTransactions';
import useAssets from './hooks/useAssets';
import useProposals from './hooks/useProposals';

// Lib
import { toFiat } from 'lib/currency';
import { ROUTES } from 'constants/routes';
import millify from 'millify';

// Assets
import defaultDaoIcon from 'assets/default_dao.svg';
import { ArrowLeft } from 'react-feather';

// Styles
import styles from './DAOPage.module.scss';
import genericStyles from '../Container.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(genericStyles);

const MILLIFY_THRESHOLD = 1000000;
const MILLIFY_PRECISION = 3;

const toDaoPage = (zna: string) => (route: ROUTES) =>
	ROUTES.ZDAO + '/' + zna + route;

const DAOPage: React.FC = () => {
	const { pathname } = useLocation();
	const { path } = useRouteMatch();
	const { setNavbarTitle } = useNavbar();

	const { dao, isLoading, zna } = useCurrentDao();
	const { transactions, isLoading: isLoadingTransactions } =
		useTransactions(dao);
	const { assets, totalUsd, isLoading: isLoadingAssets } = useAssets(dao);
	const { proposals, isLoading: isLoadingProposals } = useProposals(dao);

	const daoData = dao;

	const to = toDaoPage(zna);

	useUpdateEffect(() => {
		if (dao) {
			setNavbarTitle('DAOs - ' + dao.title);
		} else {
			setNavbarTitle('DAOs');
		}
	}, [dao]);

	const Loading = () => (
		<LoadingIndicator
			className={styles.Loading}
			text={
				<>
					Loading DAO at <b>{zna}</b>
				</>
			}
		/>
	);

	return (
		<div className={cx(genericStyles.Container, 'main', 'background-primary')}>
			{isLoading ? (
				<Loading />
			) : dao ? (
				<>
					<div id="dao-page-nav-tabs">
						<Link className={styles.Back} to={ROUTES.ZDAO}>
							<ArrowLeft /> All DAOs
						</Link>

						<ul className={genericStyles.Stats}>
							<div className={styles.Header}>
								<div className={styles.Icon}>
									<img alt="dao logo" src={defaultDaoIcon} />
								</div>
								<h1>{daoData?.title}</h1>
							</div>
							<div className={styles.Stat}>
								<StatsWidget
									className="normalView"
									fieldName="Total Value"
									isLoading={isLoadingAssets}
									// Millify if above
									title={
										'$' +
										((totalUsd ?? 0) >= MILLIFY_THRESHOLD
											? millify(totalUsd!, { precision: MILLIFY_PRECISION })
											: toFiat(totalUsd ?? 0))
									}
								/>
							</div>
						</ul>

						<nav className={genericStyles.Links}>
							<Link
								className={cx({
									Active: pathname.includes(ROUTES.ZDAO_ASSETS),
								})}
								to={to(ROUTES.ZDAO_ASSETS)}
							>
								Assets
							</Link>
							<Link
								className={cx({
									Active: pathname.includes(ROUTES.ZDAO_TRANSACTIONS),
								})}
								to={to(ROUTES.ZDAO_TRANSACTIONS)}
							>
								Transactions
							</Link>
							<Link
								className={cx({
									Active: pathname.includes(ROUTES.ZDAO_PROPOSALS),
								})}
								to={to(ROUTES.ZDAO_PROPOSALS)}
							>
								Proposals
							</Link>
						</nav>
					</div>

					{/* Routes */}
					<Switch>
						<Route
							exact
							path={to(ROUTES.ZDAO_ASSETS)}
							component={() => (
								<Assets assets={assets} isLoading={isLoadingAssets} />
							)}
						/>
						<Route
							exact
							path={to(ROUTES.ZDAO_TRANSACTIONS)}
							render={() => (
								<Transactions
									isLoading={isLoadingTransactions}
									transactions={transactions}
								/>
							)}
						/>
						<Route
							exact
							path={to(ROUTES.ZDAO_PROPOSALS)}
							component={() => <Proposals dao={dao} />}
						/>
						<Route
							exact
							path={`${to(ROUTES.ZDAO_PROPOSALS)}/:proposalId`}
							component={() => <ProposalDetail dao={dao} />}
						/>
						<Route exact path={path}>
							<Redirect to={to(ROUTES.ZDAO_ASSETS)} />
						</Route>
					</Switch>
				</>
			) : (
				<></>
				// <Error />
			)}
		</div>
	);
};

export default DAOPage;
