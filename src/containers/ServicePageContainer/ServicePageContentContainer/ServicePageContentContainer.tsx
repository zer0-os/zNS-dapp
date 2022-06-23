//- Components Imports
import { FutureButton } from 'components';

//- Constants Imports
import { BUTTON_TEXT } from './ServicePageContentContainer.constants';

//- Styles Imports
import styles from './ServicePageContentContainer.module.scss';

type ServicePageContentContainerProps = {
	onClick: () => void;
	children: React.ReactNode;
};

const ServicePageContentContainer: React.FC<
	ServicePageContentContainerProps
> = ({ onClick, children }) => {
	return (
		<div className={styles.ContentContainer}>
			<div className={styles.Content}>
				{children}

				<div className={styles.ButtonContainer}>
					<FutureButton glow className={styles.Button} onClick={onClick}>
						{BUTTON_TEXT}
					</FutureButton>
				</div>
			</div>
		</div>
	);
};
export default ServicePageContentContainer;
