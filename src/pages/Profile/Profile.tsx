import { useMemo } from 'react';

// Components
import { ConnectWalletButton } from 'containers';
import {
	Link,
	Redirect,
	Route,
	Switch,
	useHistory,
	useRouteMatch,
} from 'react-router-dom';

// Library
import { ROUTES } from 'constants/routes';
import { useDidMount } from 'lib/hooks/useDidMount';
import { useNavbar } from 'lib/hooks/useNavbar';
import { TABS } from './Profile.constants';
import { useWeb3 } from 'lib/web3-connection/useWeb3';

// Styles
import styles from './Profile.module.scss';
import classNames from 'classnames/bind';
import { ArrowLeft } from 'react-feather';

const cx = classNames.bind(styles) as (...args: any) => string;

/**
 * Converts a route to a Profile route
 * i.e., prepends the Profile route
 * @param route to convert
 * @returns route with profile route prepended
 */
const r = (route: string) => {
	return ROUTES.PROFILE + route;
};

/**
 * User profile page for the currenctly connected user.
 * This can be adapted to work with any user
 * @returns
 */
const Profile = () => {
	const { account } = useWeb3();

	// React-router stuff
	const { length: canGoBack, goBack, push, location } = useHistory();
	const { path } = useRouteMatch();

	const { setNavbarTitle } = useNavbar();

	/////////////
	// Effects //
	/////////////

	useDidMount(() => {
		setNavbarTitle('Your Profile');
		document.title = import.meta.env.VITE_TITLE + ' | Profile';
	});

	///////////////
	// Functions //
	///////////////

	/**
	 * Returns from profile back to where the user arrived from
	 */
	const onBack = () => {
		if (canGoBack) {
			goBack();
		} else {
			push(ROUTES.MARKET);
		}
	};

	const Content = useMemo(
		() => (
			<>
				<nav className={styles.Nav}>
					{TABS.map((route) => (
						<Link
							key={route.title}
							className={cx({
								Selected: location.pathname === r(route.location),
							})}
							to={r(route.location)}
							data-title={route.title} // set title here for css bold trick
							replace // hitting back should take to last non-profile page
						>
							{route.title}
						</Link>
					))}
				</nav>
				<Switch>
					{TABS.map((route) => (
						<Route
							key={route.title}
							exact
							path={r(route.location)}
							component={route.component}
						/>
					))}
					<Route exact path={path}>
						<Redirect to={r(TABS[0].location)} />
					</Route>
				</Switch>
			</>
		),
		[location, path],
	);

	////////////
	// Render //
	////////////

	return (
		<main className={styles.Container}>
			<div className={styles.Header}>
				<button className={styles.Back} onClick={onBack}>
					<ArrowLeft color="white" /> <span>My Profile</span>
				</button>
				<w3m-account-button balance="hide" />
			</div>
			{account ? (
				Content
			) : (
				<div className={styles.Connect}>
					<p>Please connect a wallet to view your profile.</p>
					<ConnectWalletButton>Connect Wallet</ConnectWalletButton>
				</div>
			)}
		</main>
	);
};

export default Profile;
