//- Library Imports
import { useHistory } from 'react-router-dom';

//- Constants Imports
import { ROUTES } from 'constants/routes';

//- Components Imports
import PageNotFound from './content/PageNotFound/PageNotFound';

//- Container Imports
import ServicePageContainer from 'containers/ServicePageContainer';

const PageNotFoundContainer: React.FC = () => {
	const { push: goTo } = useHistory();

	// Navigate to Market
	const onClick = () => {
		goTo(ROUTES.MARKET);
	};

	return (
		<ServicePageContainer>
			<PageNotFound onClick={onClick} />
		</ServicePageContainer>
	);
};
export default PageNotFoundContainer;
