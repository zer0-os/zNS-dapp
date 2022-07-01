import moment from 'moment';
import { AssetType } from '@zero-tech/zdao-sdk';
import type { Asset } from 'lib/types/dao';
import type { Option } from 'components/Dropdowns/OptionDropdown';
import { formatDateTime } from 'lib/utils/datetime';
import type { VotingDetailItem } from './CreateProposal.types';
import { DEFAULT_VOTE_DURATION_DAYS } from './CreateProposal.constants';

export const getTokenOption = (options: Option[], value?: string) => {
	return options.find((option) => option.value === value);
};

export const getTokenOptionsFromAssets = (assets?: Asset[]): Option[] => {
	if (!assets) return [];

	return assets
		.filter((asset) => asset.type === AssetType.ERC20)
		.map((asset) => ({
			title: asset.name,
			value: asset.address,
		}));
};

export const getVotingDetails = (): VotingDetailItem[] => {
	const voteDuration: VotingDetailItem = {
		label: 'Vote Duration',
		value: DEFAULT_VOTE_DURATION_DAYS + ' days',
	};
	const votingEnds: VotingDetailItem = {
		label: 'Voting Ends',
		value: formatDateTime(
			moment().add(DEFAULT_VOTE_DURATION_DAYS, 'days').toDate(),
			'M/D/YYYY h:mm A Z',
		),
	};
	const votingSystem: VotingDetailItem = {
		label: 'Voting System',
		value: 'Weighted Single Choice',
	};
	const executionCriteria: VotingDetailItem = {
		label: 'Execution Criteria',
		value: 'Absolute Majority (<50%)',
	};

	return [voteDuration, votingEnds, votingSystem, executionCriteria];
};
