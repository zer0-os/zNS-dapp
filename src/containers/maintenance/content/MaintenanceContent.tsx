//- Components Imports
import { FutureButton } from 'components';

//- Constants Imports
import {
	TITLE,
	SECONDARY_TITLE,
	SUBTEXT,
	BUTTON_TEXT,
} from './MaintenanceContent.constants';

//- Styles Imports
import styles from './MaintenanceContent.module.scss';

type MaintenanceContentProps = { onClick: () => void };

enum PAGE_TYPE {
	PAGE_NOT_FOUND,
	GENERAL_ERROR,
	MAINTENANCE,
}

const pageType = PAGE_TYPE.PAGE_NOT_FOUND;

const MaintenanceContent: React.FC<MaintenanceContentProps> = ({ onClick }) => {
	return (
		<div className={styles.Content}>
			<div className={styles.HeadingContainer}>
				<h1>{TITLE.PAGE_NOT_FOUND}</h1>

				{pageType !== PAGE_TYPE.PAGE_NOT_FOUND && (
					<h2>{SECONDARY_TITLE.PAGE_NOT_FOUND}</h2>
				)}
			</div>

			<div className={styles.SubTextContainer}>
				<p>{SUBTEXT.PAGE_NOT_FOUND}</p>
			</div>
			{/* 
			<div className={styles.SubTextContainer}>
				<p>{SUBTEXT.PAGE_NOT_FOUND}</p>
			</div> */}

			<div className={styles.ButtonContainer}>
				<FutureButton glow className={styles.Button} onClick={onClick}>
					{BUTTON_TEXT}
				</FutureButton>
			</div>
		</div>
	);
};

export default MaintenanceContent;
