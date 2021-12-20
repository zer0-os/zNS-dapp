import { StakingContainer } from 'containers/staking';
import { PoolSelectProvider } from 'lib/providers/staking/PoolSelectProvider';
import { StakingSDKProvider } from 'lib/providers/staking/StakingSDKProvider';
import { StakingUserDataProvider } from 'lib/providers/staking/StakingUserDataProvider';
import { BrowserRouter } from 'react-router-dom';

const Staking = () => {
	return (
		<BrowserRouter>
			<StakingSDKProvider>
				<PoolSelectProvider>
					<StakingUserDataProvider>
						<StakingContainer />
					</StakingUserDataProvider>
				</PoolSelectProvider>
			</StakingSDKProvider>
		</BrowserRouter>
	);
};

export default Staking;
