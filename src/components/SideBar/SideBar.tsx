import { Link, useLocation } from 'react-router-dom';
import { BuyTokenRedirect } from 'containers';

import { LINKS } from 'constants/nav';
import styles from './SideBar.module.scss';
import classNames from 'classnames/bind';
import { LOGO, ZERO } from 'constants/assets';
import { URLS } from 'constants/urls';
const cx = classNames.bind(styles);

const SideBar = () => {
	const { pathname } = useLocation();

	return (
		<div className={styles.Container}>
			<div>
				{/* TODO: update src image here */}
				<img alt="app logo" src={LOGO} className={styles.Icon} />
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
				<BuyTokenRedirect />
			</div>
		</div>
	);
};

export default SideBar;
