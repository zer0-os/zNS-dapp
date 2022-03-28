import { DAOContainer } from 'containers/DAO';
import { CurrentDaoProvider } from 'lib/dao/providers/CurrentDaoProvider';
import { ZdaoSdkProvider } from 'lib/dao/providers/ZdaoSdkProvider';

const DAO: React.FC = () => {
	return (
		<ZdaoSdkProvider>
			<CurrentDaoProvider>
				<DAOContainer />
			</CurrentDaoProvider>
		</ZdaoSdkProvider>
	);
};

export default DAO;
