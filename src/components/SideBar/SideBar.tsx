import { Link, useLocation } from 'react-router-dom';
import { BuyTokenRedirect } from 'containers';

import { LINKS } from 'constants/nav';
import styles from './SideBar.module.scss';
import classNames from 'classnames/bind';
import { LOGO, ZERO } from 'constants/assets';
import { URLS } from 'constants/urls';
import { appFromPathname } from 'lib/utils';
import { useWeb3React } from '@web3-react/core';
import { chainIdToNetworkType, NETWORK_TYPES } from 'lib/network';
import { startCase, toLower } from 'lodash';
const cx = classNames.bind(styles);

const SideBar = () => {
	const { pathname } = useLocation();
	const { chainId } = useWeb3React();

	const network = chainIdToNetworkType(chainId);

	return (
		<div className={styles.BorderContainer}>
			<div className={styles.Container}>
				<div className={styles.LinkContainer}>
					<Link to={appFromPathname(pathname)}>
						<img alt="app logo" src={LOGO} />
					</Link>
					<ul className={styles.Links}>
						{LINKS.map((l) => (
							<li key={l.label}>
								<Link
									to={l.route}
									className={cx({ Selected: pathname.startsWith(l.route) })}
								>
									<img alt={`${l.label.toLowerCase()} icon`} src={l.icon} />
									<label>{l.label}</label>
								</Link>
							</li>
						))}
					</ul>
				</div>
				<div className={styles.Footer}>
					<a
						className={styles.Zero}
						target="_blank"
						href={URLS.ZERO}
						rel="noreferrer"
					>
						<img alt="zero logo" src={ZERO} />
					</a>
					{network !== NETWORK_TYPES.MAINNET && (
						<label className={styles.Network}>
							Network: {startCase(toLower(network))}
						</label>
					)}
					<BuyTokenRedirect />
				</div>
			</div>
		</div>
	);
};

export default SideBar;
