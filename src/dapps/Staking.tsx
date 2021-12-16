import { StakingContainer } from 'containers/staking';
import { PoolSelectProvider } from 'lib/providers/staking/PoolSelectProvider';
import StakingProvider from 'lib/providers/staking/StakingProvider';
import { StakingSDKProvider } from 'lib/providers/staking/StakingSDKProvider';
import { BrowserRouter } from 'react-router-dom';

const Staking = () => {
	return (
		<BrowserRouter>
			<StakingProvider>
				<StakingSDKProvider>
					<PoolSelectProvider>
						<StakingContainer />
					</PoolSelectProvider>
				</StakingSDKProvider>
			</StakingProvider>
		</BrowserRouter>
	);
};

export default Staking;
