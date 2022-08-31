import { StakingContainer } from 'containers/staking';
import { useDidMount } from 'lib/hooks/useDidMount';
import { PoolSelectProvider } from 'lib/providers/staking/PoolSelectProvider';
import { StakingSDKProvider } from 'lib/providers/staking/StakingSDKProvider';
import { StakingUserDataProvider } from 'lib/providers/staking/StakingUserDataProvider';

const Staking: React.FC = () => {
	useDidMount(() => {
		document.title = process.env.REACT_APP_TITLE + ' | Staking';
	});

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
