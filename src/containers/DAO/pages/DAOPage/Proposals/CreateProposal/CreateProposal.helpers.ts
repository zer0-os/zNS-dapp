import moment from 'moment';
import { AssetType } from '@zero-tech/zdao-sdk';
import { ethers } from 'ethers';
import type { Asset } from 'lib/types/dao';
import type { Option } from 'components/Dropdowns/OptionDropdown/OptionDropdown';
import { formatDateTime } from 'lib/utils/datetime';
import type { VotingDetailItem } from './CreateProposal.types';
import {
	DEFAULT_VOTE_DURATION_DAYS,
	ProposalInputFieldKeys,
	ProposalFormDefaultValues,
	ProposalFormDefaultErrors,
} from './CreateProposal.constants';

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

export const isValidERC20Address = (address: string): boolean => {
	return ethers.utils.isAddress(address);
};

export const validateCreateProposalForm = (
	formValues: Record<ProposalInputFieldKeys, string | undefined>,
): Record<ProposalInputFieldKeys, string | undefined> => {
	const errors = { ...ProposalFormDefaultErrors };
	if (formValues.title === ProposalFormDefaultValues.title) {
		errors.title = 'Please enter a title for your proposal';
	}

	if (formValues.amount === ProposalFormDefaultValues.amount) {
		errors.amount = 'Please enter an amount you wish to send';
	}

	if (formValues.recipient === ProposalFormDefaultValues.recipient) {
		errors.recipient = 'Please enter a recipient wallet address';
	} else if (!isValidERC20Address(formValues.recipient!)) {
		errors.recipient = 'Please enter a valid ethereum wallet address';
	}

	if (formValues.body === ProposalFormDefaultValues.body) {
		errors.body = 'Please add a description to your funding proposal';
	}

	return errors;
};
