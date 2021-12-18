import { StakingContainer } from 'containers/staking';
import { PoolSelectProvider } from 'lib/providers/staking/PoolSelectProvider';
import { StakingSDKProvider } from 'lib/providers/staking/StakingSDKProvider';
import { BrowserRouter } from 'react-router-dom';

const Staking = () => {
	return (
		<BrowserRouter>
			<StakingSDKProvider>
				<PoolSelectProvider>
					<StakingContainer />
				</PoolSelectProvider>
			</StakingSDKProvider>
		</BrowserRouter>
	);
};

export default Staking;
