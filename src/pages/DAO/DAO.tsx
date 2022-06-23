//- Container Imports
import { DAOContainer } from 'containers/DAO';
import PageContainer from 'containers/PageContainer';

//- Library Imports
import { CurrentDaoProvider } from 'lib/dao/providers/CurrentDaoProvider';
import { ZdaoSdkProvider } from 'lib/dao/providers/ZdaoSdkProvider';

const DAO: React.FC = () => {
	return (
		<PageContainer>
			<ZdaoSdkProvider>
				<CurrentDaoProvider>
					<DAOContainer />
				</CurrentDaoProvider>
			</ZdaoSdkProvider>
		</PageContainer>
	);
};

export default DAO;
