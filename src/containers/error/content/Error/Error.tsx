//- Constants Imports
import {
	TITLE,
	SUBTEXT,
} from 'containers/ServicePageContainer/ServicePageContentContainer/ServicePageContentContainer.constants';

//- Container Imports
import ServicePageContentContainer from 'containers/ServicePageContainer/ServicePageContentContainer/ServicePageContentContainer';

//- Styles Imports
import styles from './Error.module.scss';

type ErrorProps = { onClick: () => void };

const Error: React.FC<ErrorProps> = ({ onClick }) => {
	return (
		<ServicePageContentContainer onClick={onClick}>
			<div className={styles.HeadingContainer}>
				<h1>{TITLE.GENERAL_ERROR}</h1>
			</div>

			<div className={styles.SubTextContainer}>
				<p>{SUBTEXT.GENERAL_ERROR}</p>
			</div>
		</ServicePageContentContainer>
	);
};

export default Error;
