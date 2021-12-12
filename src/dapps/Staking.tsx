import { Overlay } from 'components';
import { StakeFlow, StakingContainer, StakePool } from 'containers/staking';
import StakingProvider from 'lib/providers/staking/StakingProvider';

const Staking = () => {
	return (
		<StakingProvider>
			<StakingContainer />
		</StakingProvider>
	);
};

export default Staking;
