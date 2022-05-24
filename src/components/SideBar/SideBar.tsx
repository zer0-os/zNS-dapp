//- React Imports
import { Link, useLocation } from 'react-router-dom';

//- Containers Imports
import { PriceWidget } from 'containers';

//- Constants Imports
import { getNavLinks } from 'lib/utils/nav';
import { ROUTES } from 'constants/routes';
import {
	DOMAIN_LOGOS,
	IS_DEFAULT_NETWORK,
	ROOT_DOMAIN,
} from 'constants/domains';
import { ALT_TEXT, COLOURS } from './SideBar.constants';
import { URLS } from 'constants/urls';

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

	const isRoot =
		IS_DEFAULT_NETWORK && (app !== ROUTES.MARKET || zna.length === 0);
	const isRootNetworkSet = ROOT_DOMAIN !== '';

	return (
		<div className={styles.BorderContainer}>
			<div className={styles.Container}>
				<div className={styles.LinkContainer}>
					<Link
						className={styles.HomeLink}
						to={
							isRoot
								? app
								: isRootNetworkSet
								? ROUTES.MARKET
								: ROUTES.MARKET + '/' + zna.split('.')[0]
						}
					>
						<img
							alt={ALT_TEXT.APP_LOGO}
							src={isRoot ? DOMAIN_LOGOS.ZERO : DOMAIN_LOGOS.WILDER_WORLD}
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
					<PriceWidget isRoot={isRoot} />
					<div className={cx(styles.ZeroIconContainer, { Hidden: isRoot })}>
						{isRootNetworkSet ? (
							<a
								className={styles.Zero}
								target="_blank"
								href={URLS.ZERO}
								rel="noreferrer"
							>
								<img alt={ALT_TEXT.ZERO_LOGO} src={DOMAIN_LOGOS.ZERO} />
							</a>
						) : (
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
