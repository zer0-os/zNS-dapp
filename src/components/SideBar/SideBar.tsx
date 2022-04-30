//- React Imports
import { Link, useLocation } from 'react-router-dom';

//- Containers Imports
import { BuyTokenRedirect } from 'containers';

//- Constants Imports
import { getNavLinks } from 'lib/utils/nav';
import { LOGO, ZERO } from 'constants/assets';
import { URLS } from 'constants/urls';
import { ALT_TEXT, COLOURS } from './SideBar.constants';

//- Styles Imports
import styles from './SideBar.module.scss';

//- Library Imports
import classNames from 'classnames/bind';
import { appFromPathname } from 'lib/utils';
import { useWeb3React } from '@web3-react/core';
import { chainIdToNetworkType, NETWORK_TYPES } from 'lib/network';
import { startCase, toLower } from 'lodash';
import { randomUUID } from 'lib/random';

const cx = classNames.bind(styles);

const SideBar = () => {
	const { pathname } = useLocation();
	const { chainId } = useWeb3React();
	const navLinks = getNavLinks();

	const network = chainIdToNetworkType(chainId);

	return (
		<div className={styles.BorderContainer}>
			<div className={styles.Container}>
				<div className={styles.LinkContainer}>
					<Link className={styles.HomeLink} to={appFromPathname(pathname)}>
						<img alt={ALT_TEXT.APP_LOGO} src={LOGO} />
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
					<BuyTokenRedirect />
					<div className={styles.ZeroIconContainer}>
						<a
							className={styles.Zero}
							target="_blank"
							href={URLS.ZERO}
							rel="noreferrer"
						>
							<img alt={ALT_TEXT.ZERO_LOGO} src={ZERO} />
						</a>
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
