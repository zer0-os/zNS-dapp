//- Containers Imports
import { MaintenanceContainer } from 'containers/maintenance';
import ServicePageContainer from 'containers/ServicePageContainer';

const Maintenance: React.FC = () => (
	<ServicePageContainer>
		<MaintenanceContainer />
	</ServicePageContainer>
);

export default Maintenance;
