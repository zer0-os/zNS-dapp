import { useState } from 'react';

// Components
import { ConnectWalletButton } from 'containers';
import { Tooltip } from 'components';
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
import { COPY_LABELS, TABS } from './Profile.constants';
import { chainIdToNetworkName } from 'lib/network';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { useWeb3React } from '@web3-react/core';
import { truncateWalletAddress } from 'lib/utils';
import { randomUUID } from 'crypto';

// Styles
import styles from './Profile.module.scss';
import classNames from 'classnames/bind';
import { ArrowLeft } from 'react-feather';
import userIcon from 'assets/user_icon.svg';

const cx = classNames.bind(styles);

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
	const { account, chainId } = useWeb3React();

	// React-router stuff
	const { length: canGoBack, goBack, push, location } = useHistory();
	const { path } = useRouteMatch();

	const { setNavbarTitle } = useNavbar();

	/**
	 * Need to handle account hovers here, as we have a label
	 * change depending on "is hovered" and "has been clicked"
	 */
	const [copyLabel, setCopyLabel] = useState<string>(COPY_LABELS.DEFAULT);
	const [isAccountHovered, setIsAccountHovered] = useState<boolean>(false);

	/////////////
	// Effects //
	/////////////

	/**
	 * Reset the copy label every time we hover/unhover
	 */
	useUpdateEffect(() => {
		if (isAccountHovered) {
			setCopyLabel(COPY_LABELS.DEFAULT);
		}
	}, [isAccountHovered]);

	useDidMount(() => {
		setNavbarTitle('Your Profile');
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

	/**
	 * Copies the profile wallet address
	 * Changes copy label to "copied"
	 */
	const copyAddress = () => {
		if (account) {
			navigator.clipboard.writeText(account);
			setCopyLabel(COPY_LABELS.COPIED);
		}
	};

	////////////
	// Render //
	////////////

	return (
		<main className={styles.Container}>
			<div className={styles.Header}>
				<button className={styles.Back} onClick={onBack}>
					<ArrowLeft color="white" /> <span>My Profile</span>
				</button>
				{account && chainId && (
					<Tooltip placement="bottom-center" text={copyLabel}>
						<button
							className={classNames(
								styles.Account,
								'border-rounded',
								'no-select',
							)}
							onClick={copyAddress}
							onMouseEnter={() => setIsAccountHovered(true)}
							onMouseLeave={() => setIsAccountHovered(false)}
						>
							<img alt="user icon" src={userIcon} />
							<div className={styles.Details}>
								<span>{chainIdToNetworkName(chainId)}</span>
								<span>{truncateWalletAddress(account, 4)}</span>
							</div>
						</button>
					</Tooltip>
				)}
			</div>
			{account ? (
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
