export const ProposalCreateSections = {
	FUND_DETAILS: {
		title: 'Fund Details',
		tooltipContent: 'Proposals are currently limited to transferring tokens',
	},
	VOTE_DETAILS: {
		title: 'Vote Details',
		tooltipContent:
			'These vote settings are defined at the root domain of this DAO',
	},
};

export enum ProposalInputFieldKeys {
	TITLE = 'title',
	BODY = 'body',
	TOKEN = 'token',
	AMOUNT = 'amount',
	SENDER = 'sender',
	RECIPIENT = 'recipient',
}

export const ProposalInputFields: Record<
	ProposalInputFieldKeys,
	{
		title: string;
		placeholder?: string;
		isDisabled?: boolean;
		comment?: string;
	}
> = {
	[ProposalInputFieldKeys.TITLE]: {
		title: 'Proposal Title',
	},
	[ProposalInputFieldKeys.BODY]: {
		title: 'Proposal Content',
	},
	[ProposalInputFieldKeys.TOKEN]: {
		title: 'Token',
	},
	[ProposalInputFieldKeys.AMOUNT]: {
		title: 'Amount',
	},
	[ProposalInputFieldKeys.SENDER]: {
		title: 'From',
		isDisabled: true,
		comment: 'Funds will be transferred from the DAO treasury.',
	},
	[ProposalInputFieldKeys.RECIPIENT]: {
		title: 'Recipient (ERC20 Address)',
		placeholder: 'Recipient Address',
	},
};

export const ProposalFormDefaultValues: Record<ProposalInputFieldKeys, string> =
	{
		[ProposalInputFieldKeys.TITLE]: '',
		[ProposalInputFieldKeys.BODY]: '',
		[ProposalInputFieldKeys.TOKEN]: '',
		[ProposalInputFieldKeys.AMOUNT]: '',
		[ProposalInputFieldKeys.SENDER]: '',
		[ProposalInputFieldKeys.RECIPIENT]: '',
	};

export const ProposalFormDefaultErrors: Record<
	ProposalInputFieldKeys,
	string | undefined
> = {
	[ProposalInputFieldKeys.TITLE]: undefined,
	[ProposalInputFieldKeys.BODY]: undefined,
	[ProposalInputFieldKeys.TOKEN]: undefined,
	[ProposalInputFieldKeys.AMOUNT]: undefined,
	[ProposalInputFieldKeys.SENDER]: undefined,
	[ProposalInputFieldKeys.RECIPIENT]: undefined,
};

export const ProposalFormConfirmModalText = {
	Discard: {
		title: 'Discard Proposal',
		body: 'If you leave now you will lose your progress on this proposal',
		cancel: 'Discard Proposal',
		confirm: 'Return',
	},
	Publish: {
		title: 'Publish Proposal?',
		body: {
			normal:
				'Your proposal will be written to the blockchain and shared with the world. You will not be able to  make changes',
			submitting: 'Approve transaction in your wallet to publish proposal...',
			publishing: {
				text: 'Publishing your proposal... ',
				tooltipContent:
					'This may take up to 20 minutes depending on the state of Ethereum blockchain',
			},
		},
		cancel: 'Return',
		confirm: 'Publish',
	},
	Success: {
		title: 'Success',
		body: 'Your proposal is live',
		cancel: 'Tweet',
		confirm: 'View Proposal',
	},
};

export const DEFAULT_VOTE_DURATION_DAYS = 7;
export const DEFAULT_VOTE_DURATION_SECONDS =
	DEFAULT_VOTE_DURATION_DAYS * 24 * 3600;
export const DEFAULT_VOTE_CHOICES = ['Approve', 'Deny'];

export const NEW_PROPOSAL_TWEET_OPTION = {
	URL: 'https://twitter.com/share?url=NEW_PROPOSAL_TWEET_URL',
	OPTIONS:
		'menubar=no,toolbar=no,resizable=no,scrollbars=no,personalbar=no,height=575,width=500',
};
