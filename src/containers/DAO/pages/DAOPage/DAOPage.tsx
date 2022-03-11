import { ROUTES } from 'constants/routes';
import {
	Link,
	Redirect,
	Route,
	Switch,
	useLocation,
	useRouteMatch,
} from 'react-router-dom';
import styles from './DAOPage.module.scss';
import genericStyles from '../Container.module.scss';
import { StatsWidget } from 'components';
import wilderLogo from 'assets/WWLogo_SVG.svg';
import classNames from 'classnames';
import Assets from './Assets/Assets';
import Transactions from './Transactions/Transactions';
const cx = classNames.bind(genericStyles);

const DAOPage = () => {
	const { pathname } = useLocation();
	const { path } = useRouteMatch();

	return (
		<Switch>
			<div
				className={cx(
					genericStyles.Container,
					'main',
					'background-primary',
					'border-primary',
					'border-rounded',
				)}
			>
				<ul className={genericStyles.Stats}>
					<div className={styles.DAO}>
						<div className={styles.Icon}>
							<img alt="dao logo" src={wilderLogo} />
						</div>
						<h1>Wilder DAO</h1>
					</div>
					<StatsWidget
						className="normalView"
						fieldName={'Value'}
						isLoading={false}
						title={'$1,234,567.00'}
						subTitle={<span className="text-success">(+12% week)</span>}
					/>
					<StatsWidget
						className="normalView"
						fieldName={'WILD Holders'}
						isLoading={false}
						title={'1,234'}
						subTitle={<span className="text-success">(+12% week)</span>}
					/>
				</ul>
				<nav className={genericStyles.Links}>
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
				<Route exact path={path + ROUTES.ZDAO_ASSETS} component={Assets} />
				<Route
					exact
					path={path + ROUTES.ZDAO_TRANSACTIONS}
					component={Transactions}
				/>
				<Route exact path={path}>
					<Redirect to={path + ROUTES.ZDAO_ASSETS} />
				</Route>
			</div>
		</Switch>
	);
};

export default DAOPage;
