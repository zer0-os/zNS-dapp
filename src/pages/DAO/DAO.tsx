import { DAOContainer } from 'containers/DAO';
import { CurrentDaoProvider } from 'lib/dao/providers/CurrentDaoProvider';
import { ProposalsProvider } from 'lib/dao/providers/ProposalsProvider';
import { ZdaoSdkProvider } from 'lib/dao/providers/ZdaoSdkProvider';

const DAO: React.FC = () => {
	return (
		<ZdaoSdkProvider>
			<CurrentDaoProvider>
				<ProposalsProvider>
					<DAOContainer />
				</ProposalsProvider>
			</CurrentDaoProvider>
		</ZdaoSdkProvider>
	);
};

export default DAO;
