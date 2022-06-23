//- React Imports
import { Link } from 'react-router-dom';

//- Library Imports
import { useHistory } from 'react-router-dom';

//- Constants Imports
import { ROUTES } from 'constants/routes';
import { ALT_TEXT } from './MaintenanceContainer.constants';

//- Components Imports
import MaintenanceContent from './content/MaintenanceContent';

//- Styles Imports
import styles from './MaintenanceContainer.module.scss';

//- Assets Imports
import networkLogo from 'assets/WWLogo_SVG.svg';

const MaintenanceContainer: React.FC = () => {
	const { push: goTo } = useHistory();

	// Navigate to Market
	const onClick = () => {
		goTo(ROUTES.MARKET);
	};

	return (
		<main className={styles.MaintenanceContainer}>
			<nav className={styles.NavBar}>
				<Link className={styles.HomeLink} to={ROUTES.MARKET}>
					<img
						alt={ALT_TEXT.NETWORK_LOGO}
						src={networkLogo}
						className={styles.Logo}
					/>
				</Link>
			</nav>

			<MaintenanceContent onClick={onClick} />
		</main>
	);
};

export default MaintenanceContainer;
