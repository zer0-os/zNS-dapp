//- Constants Imports
import { TITLE, SUBTEXT } from '../MaintenanceContent.constants';

//- Styles Imports
import styles from './Error.module.scss';

const Error = () => {
	return (
		<>
			<div className={styles.HeadingContainer}>
				<h1>{TITLE.GENERAL_ERROR}</h1>
			</div>

			<div className={styles.SubTextContainer}>
				<p>{SUBTEXT.GENERAL_ERROR}</p>
			</div>
		</>
	);
};

export default Error;
