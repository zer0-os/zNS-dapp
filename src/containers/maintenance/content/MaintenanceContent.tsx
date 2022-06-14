//- Components Imports
import { FutureButton } from 'components';
import PageNotFound from './PageNotFound/PageNotFound';
import Error from './Error/Error';
import Maintenance from './Maintenance/Maintenance';

//- Constants Imports
import { BUTTON_TEXT } from './MaintenanceContent.constants';

//- Styles Imports
import styles from './MaintenanceContent.module.scss';

type MaintenanceContentProps = { onClick: () => void };

const MaintenanceContent: React.FC<MaintenanceContentProps> = ({ onClick }) => {
	// TODO:: REPLACE HARD CODED TOGGLES
	const enableMaintenance = false;
	const isError = false;
	const isPageNotFound = true;

	return (
		<div className={styles.ContentContainer}>
			<div className={styles.Content}>
				{isPageNotFound && <PageNotFound />}
				{isError && <Error />}
				{enableMaintenance && <Maintenance />}

				<div className={styles.ButtonContainer}>
					<FutureButton glow className={styles.Button} onClick={onClick}>
						{BUTTON_TEXT}
					</FutureButton>
				</div>
			</div>
		</div>
	);
};

export default MaintenanceContent;
