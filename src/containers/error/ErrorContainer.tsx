//- Library Imports
import { useHistory } from 'react-router-dom';

//- Constants Imports
import { ROUTES } from 'constants/routes';

//- Components Imports
import Error from './content/Error/Error';

const ErrorContainer: React.FC = () => {
	const { push: goTo } = useHistory();

	// Navigate to Market
	const onClick = () => {
		goTo(ROUTES.MARKET);
	};

	return (
		<>
			<Error onClick={onClick} />
		</>
	);
};
export default ErrorContainer;
