//- Constants Imports
import {
	TITLE,
	SECONDARY_TITLE,
	SUBTEXT,
} from 'containers/ServicePageContainer/ServicePageContentContainer/ServicePageContentContainer.constants';

//- Container Imports
import ServicePageContainer from 'containers/ServicePageContainer';
import ServicePageContentContainer from 'containers/ServicePageContainer/ServicePageContentContainer/ServicePageContentContainer';

//- Styles Imports
import styles from './PageNotFound.module.scss';

type PageNotFoundProps = { onClick: () => void };

const PageNotFound: React.FC<PageNotFoundProps> = ({ onClick }) => {
	return (
		<ServicePageContainer>
			<ServicePageContentContainer onClick={onClick}>
				<div className={styles.HeadingContainer}>
					<h1>{TITLE.PAGE_NOT_FOUND}</h1>

					<h2>{SECONDARY_TITLE.PAGE_NOT_FOUND}</h2>
				</div>

				<div className={styles.SubTextContainer}>
					<p>{SUBTEXT.PAGE_NOT_FOUND}</p>
				</div>
			</ServicePageContentContainer>
		</ServicePageContainer>
	);
};

export default PageNotFound;
