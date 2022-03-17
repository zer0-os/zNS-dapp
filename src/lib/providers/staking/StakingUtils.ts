import { MaybeUndefined } from 'lib/types';
import {
	WrappedStakingPool,
	WrappedStakingPools,
} from './StakingProviderTypes';

export const getPoolByDomain = (
	pools: WrappedStakingPools,
	domain: string,
): MaybeUndefined<WrappedStakingPool> => {
	const pool = Object.values(pools).filter(
		(p: WrappedStakingPool) => p.content.domain === domain,
	) as WrappedStakingPool[];

	return pool.length ? pool[0] : undefined;
};
