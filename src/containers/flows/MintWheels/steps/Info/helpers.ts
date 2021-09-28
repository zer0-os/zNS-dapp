import { Stage } from '../../types';

export const getCopy = (isUserEligible: boolean, dropStage: Stage): string => {
	// Cases to handle
	// 1. Drop hasn't started yet
	// 2. Drop is available to whitelist
	// 3. Drop is public
	// All need to handle user eligibility
	switch (dropStage) {
		case Stage.Upcoming:
			return '';
		case Stage.Whitelist:
			return '';
		case Stage.Public:
			return '';
		case Stage.Ended:
			return '';
		default:
			return '';
	}
};
