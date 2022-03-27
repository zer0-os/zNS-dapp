import { Link, useLocation } from 'react-router-dom';
import { BuyTokenRedirect } from 'containers';

import { ROUTES } from 'constants/routes';

import marketIcon from './assets/icon_market.svg';
import stakingIcon from './assets/icon_staking.svg';

import styles from './SideBar.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const LINKS = [
	{
		label: 'Market',
		route: ROUTES.MARKET,
		icon: marketIcon,
	},
	{
		label: 'Staking',
		route: ROUTES.STAKING,
		icon: stakingIcon,
	},
];

const SideBar = () => {
	const { pathname } = useLocation();

	return (
		<div className={styles.Container}>
			<div>
				{/* TODO: update src image here */}
				<div className={styles.Icon}></div>
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
			<div>
				<BuyTokenRedirect />
			</div>
		</div>
	);
};

export default SideBar;
