import { StakingContainer } from 'containers/staking';
import { PoolSelectProvider } from 'lib/providers/staking/PoolSelectProvider';
import { StakingSDKProvider } from 'lib/providers/staking/StakingSDKProvider';
import { StakingUserDataProvider } from 'lib/providers/staking/StakingUserDataProvider';

const Staking: React.FC = () => {
	return (
		<StakingSDKProvider>
			<PoolSelectProvider>
				<StakingUserDataProvider>
					<StakingContainer />
				</StakingUserDataProvider>
			</PoolSelectProvider>
		</StakingSDKProvider>
	);
};

export default Staking;
