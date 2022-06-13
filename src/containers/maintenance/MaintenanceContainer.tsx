//- React Imports
import { Link } from 'react-router-dom';

//- Library Imports
import { useHistory } from 'react-router-dom';

//- Constants Imports
import { ROUTES } from 'constants/routes';
import { BUTTON_TEXT } from './MaintenanceContainer.constants';

//- Components Imports
import { FutureButton } from 'components';

//- Styles Imports
import styles from './MaintenanceContainer.module.scss';

//- Assets Imports
import logo from 'assets/WWLogo_SVG.svg';

type MaintenanceProps = {};

const MaintenanceContainer: React.FC<MaintenanceProps> = () => {
	const { push: goTo } = useHistory();

	// Navigate to Market
	const onClick = () => {
		goTo(ROUTES.MARKET);
	};

	return (
		<main className={styles.MaintenanceContainer}>
			<nav className={styles.NavBar}>
				<Link className={styles.HomeLink} to={ROUTES.MARKET}>
					<img alt="logo" src={logo} className={styles.Logo} />
				</Link>
			</nav>

			<div className={styles.ContentContainer}>
				<div className={styles.Content}>
					<h1 className={styles.Title}>404</h1>
					<h2 className={styles.SecondaryTitle}>Lost in the Metaverse</h2>

					<div className={styles.Subtext}>
						We're sorry, we couldn't find the page you're looking for.
					</div>

					<FutureButton glow className={styles.Button} onClick={onClick}>
						{BUTTON_TEXT}
					</FutureButton>
				</div>
			</div>
		</main>
	);
};

export default MaintenanceContainer;
