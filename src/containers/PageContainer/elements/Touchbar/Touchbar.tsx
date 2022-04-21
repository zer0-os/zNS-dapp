//- React Imports
import { Link, useLocation } from 'react-router-dom';

//- Constant Imports
import { getMobileNavLinks } from 'constants/nav';
import { COLOURS } from './Touchbar.constants';

//- Styles Imports
import styles from './Touchbar.module.scss';

//- Class Names
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export const Touchbar: React.FC = () => {
	const { pathname } = useLocation();
	const navLinks = getMobileNavLinks();

	return (
		<div className={styles.TouchbarContainer}>
			<ul className={styles.NavLinks}>
				{navLinks.map((l) => (
					<li key={`${l.label}${Math.random()}`}>
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
										pathname.startsWith(l.route) ? COLOURS.WHITE : COLOURS.ALTO,
									)}
							</div>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Touchbar;
