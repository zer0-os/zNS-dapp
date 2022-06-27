/**
 * Note 27/06/2022:
 * There's a few instances of startsWith(wilder)
 * This is because we only want to show WILD token and
 * the WW icon on the wilder network. We don't have anything
 * specified for other networks, so for now, we will just
 * handle WW.
 */

//- React Imports
import { Link, useLocation } from 'react-router-dom';

//- Containers Imports
import { PriceWidget } from 'containers';

//- Constants Imports
import { getNavLinks } from 'lib/utils/nav';
import { ROUTES } from 'constants/routes';
import { DOMAIN_LOGOS, IS_DEFAULT_NETWORK } from 'constants/domains';
import { ALT_TEXT, COLOURS } from './SideBar.constants';

//- Styles Imports
import styles from './SideBar.module.scss';

//- Library Imports
import classNames from 'classnames/bind';
import { appFromPathname, zNAFromPathname } from 'lib/utils';
import { useWeb3React } from '@web3-react/core';
import { chainIdToNetworkType, NETWORK_TYPES } from 'lib/network';
import { startCase, toLower } from 'lodash';
import { randomUUID } from 'lib/random';

const cx = classNames.bind(styles);

const SideBar = () => {
	const { pathname } = useLocation();
	const { chainId } = useWeb3React();

	const navLinks = getNavLinks();

	/* Get location context */
	const network = chainIdToNetworkType(chainId);
	const zna = zNAFromPathname(pathname);
	const app = appFromPathname(pathname);
	const isProfilePath = app.includes(ROUTES.PROFILE);
	const isDefaultNetworkRootPath =
		IS_DEFAULT_NETWORK && (app !== ROUTES.MARKET || zna.length === 0);

	return (
		<div className={styles.BorderContainer}>
			<div className={styles.Container}>
				<div className={styles.LinkContainer}>
					<Link
						className={styles.HomeLink}
						to={
							isDefaultNetworkRootPath
								? isProfilePath
									? ROUTES.MARKET
									: app
								: !IS_DEFAULT_NETWORK
								? ROUTES.MARKET
								: ROUTES.MARKET + '/' + zna.split('.')[0]
						}
					>
						<img
							alt={ALT_TEXT.APP_LOGO}
							src={
								zna.startsWith('wilder')
									? DOMAIN_LOGOS.WILDER_WORLD
									: DOMAIN_LOGOS.ZERO
							}
						/>
					</Link>
					<ul className={styles.Links}>
						{navLinks.map((l) => (
							<li key={`${l.label}${randomUUID()}`}>
								<Link
									to={l.route}
									className={cx({ Selected: pathname.startsWith(l.route) })}
								>
									<div
										className={cx(
											{ Selected: pathname.startsWith(l.route) },
											styles.ImageContainer,
										)}
									>
										{l.icon &&
											l.icon(
												pathname.startsWith(l.route)
													? COLOURS.WHITE
													: COLOURS.ALTO,
											)}
									</div>
									<label>{l.label}</label>
								</Link>
							</li>
						))}
					</ul>
				</div>

				<div className={styles.Footer}>
					<PriceWidget isRoot={!zna.startsWith('wilder')} />
					<div
						className={cx(styles.ZeroIconContainer, {
							Hidden: isDefaultNetworkRootPath,
						})}
					>
						{zna.startsWith('wilder') && (
							<Link className={styles.Zero} to={app}>
								<img alt={ALT_TEXT.ZERO_LOGO} src={DOMAIN_LOGOS.ZERO} />
							</Link>
						)}
					</div>
					{network !== NETWORK_TYPES.MAINNET && (
						<label className={styles.Network}>
							Network: {startCase(toLower(network))}
						</label>
					)}
				</div>
			</div>
		</div>
	);
};

export default SideBar;
