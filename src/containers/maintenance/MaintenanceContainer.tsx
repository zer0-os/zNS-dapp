//- Library Imports
import { useHistory } from 'react-router-dom';

//- Constants Imports
import { ROUTES } from 'constants/routes';

//- Components Imports
import Maintenance from './content/Maintenance/Maintenance';

const MaintenanceContainer: React.FC = () => {
	const { push: goTo } = useHistory();

	// Navigate to Market
	const onClick = () => {
		goTo(ROUTES.MARKET);
	};

	return (
		<>
			<Maintenance onClick={onClick} />
		</>
	);
};
export default MaintenanceContainer;