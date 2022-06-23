//- Constants Imports
import { TITLE, SUBTEXT } from '../MaintenanceContent.constants';

//- Utils Imports
import { getLinkText } from '../MaintenanceContent.utils';

//- Styles Imports
import styles from './Maintenance.module.scss';

const Maintenance = () => {
	const linkText = getLinkText();
	return (
		<>
			<div className={styles.HeadingContainer}>
				<h1>{TITLE.MAINTENANCE}</h1>
			</div>

			<div className={styles.SubTextContainer}>
				<p>{SUBTEXT.MAINTENANCE}</p>
			</div>

			<div className={styles.LinkText}>{linkText}</div>
		</>
	);
};

export default Maintenance;
