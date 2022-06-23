//- Container Imports
import PageContainer from 'containers/PageContainer';
import { StakingContainer } from 'containers/staking';

//- Library Imports
import { PoolSelectProvider } from 'lib/providers/staking/PoolSelectProvider';
import { StakingSDKProvider } from 'lib/providers/staking/StakingSDKProvider';
import { StakingUserDataProvider } from 'lib/providers/staking/StakingUserDataProvider';

const Staking: React.FC = () => {
	return (
		<PageContainer>
			<StakingSDKProvider>
				<PoolSelectProvider>
					<StakingUserDataProvider>
						<StakingContainer />
					</StakingUserDataProvider>
				</PoolSelectProvider>
			</StakingSDKProvider>
		</PageContainer>
	);
};

export default Staking;
