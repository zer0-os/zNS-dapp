// React
import React, { useEffect, useCallback } from 'react';
import {
	Link,
	Redirect,
	Route,
	Switch,
	useLocation,
	useRouteMatch,
	useHistory,
} from 'react-router-dom';

// Components
import Assets from './Assets/Assets';
import Transactions from './Transactions/Transactions';
import { Proposals, ProposalDetail, CreateProposal } from './Proposals';
import { LoadingIndicator, StatsWidget, FutureButton } from 'components';

// Hooks
import { useNavbar } from 'lib/hooks/useNavbar';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { useCurrentDao } from 'lib/dao/providers/CurrentDaoProvider';
import useTransactions from './hooks/useTransactions';
import useAssets from './hooks/useAssets';
import { useProposals } from 'lib/dao/providers/ProposalsProvider';

// Lib
import { toFiat } from 'lib/currency';
import useBalance from 'lib/hooks/useBalance';
import { ROUTES } from 'constants/routes';
import millify from 'millify';

// Assets
import defaultDaoIcon from 'assets/default_dao.svg';
import { ArrowLeft } from 'react-feather';

// Styles
import styles from './DAOPage.module.scss';
import genericStyles from '../Container.module.scss';
import classNames from 'classnames/bind';

// Constants
import { DAO_CREATE_PROPOSAL } from './Proposals/Proposals.constants';
const cx = classNames.bind(genericStyles);

const MILLIFY_THRESHOLD = 1000000;
const MILLIFY_PRECISION = 3;

const toDaoPage = (zna: string) => (route: ROUTES) =>
	ROUTES.ZDAO + '/' + zna + route;

const DAOPage: React.FC = () => {
	const { pathname } = useLocation();
	const { path } = useRouteMatch();
	const history = useHistory();
	const { setNavbarTitle } = useNavbar();

	const { dao, isLoading, zna } = useCurrentDao();
	const { transactions, isLoading: isLoadingTransactions } =
		useTransactions(dao);
	const { assets, totalUsd, isLoading: isLoadingAssets } = useAssets(dao);
	const { fetch: fetchProposals } = useProposals();
	const { balance } = useBalance(dao?.votingToken.token);

	const daoData = dao;

	const to = toDaoPage(zna);

	useEffect(() => {
		if (dao) {
			setNavbarTitle('DAOs - ' + dao.title);
		} else {
			setNavbarTitle('DAOs');
		}
	}, [dao, setNavbarTitle]);

	useUpdateEffect(() => {
		if (dao) {
			fetchProposals();
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

	const handleNewProposalButtonClick = useCallback(() => {
		history.push(`${to(ROUTES.ZDAO_PROPOSALS)}/${DAO_CREATE_PROPOSAL}`);
	}, [history, to]);

	return (
		<div className={cx(genericStyles.Container, 'main', 'background-primary')}>
			{isLoading ? (
				<Loading />
			) : dao ? (
				<>
					<div
						className={cx({
							// @TODO: improve the following logic
							Hidden:
								pathname.split(zna)[1].startsWith('/proposals/create') ||
								pathname.split(zna)[1].startsWith('/proposals/0x'),
						})}
					>
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
						</ul>

						<nav className={genericStyles.Links}>
							<div className={genericStyles.LinksWrapper}>
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
								{!!dao.ens && (
									<Link
										className={cx({
											Active: pathname.includes(ROUTES.ZDAO_PROPOSALS),
										})}
										to={to(ROUTES.ZDAO_PROPOSALS)}
									>
										Proposals
									</Link>
								)}
							</div>

							{/* New Proposal Button */}
							{pathname === to(ROUTES.ZDAO_PROPOSALS) && balance?.gt(0) && (
								<FutureButton glow onClick={handleNewProposalButtonClick}>
									New Proposal
								</FutureButton>
							)}
						</nav>
					</div>

					{/* Routes */}
					<Switch>
						<Route
							exact
							path={to(ROUTES.ZDAO_ASSETS)}
							component={() => (
								<Assets
									assets={assets}
									safeAddress={dao?.safeAddress}
									isLoading={isLoadingAssets}
								/>
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
							render={() => <Proposals />}
						/>
						<Route
							exact
							path={`${to(ROUTES.ZDAO_PROPOSALS)}/${DAO_CREATE_PROPOSAL}`}
							render={() => <CreateProposal dao={dao} />}
						/>
						<Route
							exact
							path={`${to(ROUTES.ZDAO_PROPOSALS)}/:proposalId`}
							render={() => <ProposalDetail dao={dao} />}
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
