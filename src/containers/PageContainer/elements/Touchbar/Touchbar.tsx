//- React Imports
import { Link, useLocation } from 'react-router-dom';

//- Constant Imports
import { LINKS } from 'constants/nav';

//- Styles Imports
import styles from './Touchbar.module.scss';

//- Class Names
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export const Touchbar: React.FC = () => {
	const { pathname } = useLocation();

	return (
		<div className={styles.TouchbarContainer}>
			<ul className={styles.NavLinks}>
				{LINKS.map((l) => (
					<li key={l.label}>
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
								<img alt={`${l.label.toLowerCase()} icon`} src={l.icon} />
							</div>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Touchbar;
