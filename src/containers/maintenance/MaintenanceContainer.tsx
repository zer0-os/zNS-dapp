//- Styles Imports
import styles from './MaintenanceContainer.module.scss';

//- Assets Imports
import logo from 'assets/WWLogo_SVG.svg';

type MaintenanceProps = {};

const MaintenanceContainer: React.FC<MaintenanceProps> = () => {
	return (
		<div className={styles.MaintenanceContainer}>
			<article className={styles.Article}>
				<img alt="logo" src={logo} className={styles.Logo} />

				<h1 className={styles.Heading}>We&rsquo;ll be back soon!</h1>
				<div>
					<p>
						Sorry for the inconvenience. We&rsquo;re performing some maintenance
						at the moment. If you need to you can always follow us on{' '}
						<a href="https://discord.gg/7tyggH6eh9">Discord</a> for updates,
						otherwise we&rsquo;ll be back up shortly!
					</p>
					<p>&mdash; The Wilder World Team</p>
				</div>
			</article>
		</div>
	);
};

export default MaintenanceContainer;
