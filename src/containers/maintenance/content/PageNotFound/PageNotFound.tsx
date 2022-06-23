//- Constants Imports
import {
	TITLE,
	SECONDARY_TITLE,
	SUBTEXT,
} from '../MaintenanceContent.constants';

//- Styles Imports
import styles from './PageNotFound.module.scss';

const PageNotFound = () => {
	return (
		<>
			<div className={styles.HeadingContainer}>
				<h1>{TITLE.PAGE_NOT_FOUND}</h1>

				<h2>{SECONDARY_TITLE.PAGE_NOT_FOUND}</h2>
			</div>

			<div className={styles.SubTextContainer}>
				<p>{SUBTEXT.PAGE_NOT_FOUND}</p>
			</div>
		</>
	);
};

export default PageNotFound;
