//- Containers Imports
import { ErrorContainer } from 'containers/error';
import ServicePageContainer from 'containers/ServicePageContainer';

const Error: React.FC = () => (
	<ServicePageContainer>
		<ErrorContainer />
	</ServicePageContainer>
);

export default Error;
