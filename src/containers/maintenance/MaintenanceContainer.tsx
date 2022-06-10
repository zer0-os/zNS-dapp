//- Styles Imports
import styles from './MaintenanceContainer.module.scss';

//- Assets Imports
// import logo from './assets/WWLogo_SVG.svg';

type MaintenanceProps = {};

const MaintenanceContainer: React.FC<MaintenanceProps> = () => {
	return (
		<main className={styles.MaintenanceContainer}>
			{/* <img alt="logo" src={logo} className={styles.Logo} />

			<h1 className={styles.Heading}>We&rsquo;ll be back soon!</h1>

			<p>
				Sorry for the inconvenience. We&rsquo;re performing some maintenance at
				the moment. If you need to you can always follow us on{' '}
				<a href="https://discord.gg/7tyggH6eh9">Discord</a> for updates,
				otherwise we&rsquo;ll be back up shortly!
			</p>
			<p>&mdash; The Wilder World Team</p> */}
		</main>
	);
};

export default MaintenanceContainer;
