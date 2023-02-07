import { formatUnits } from 'ethers/lib/utils';
import type { zDAO, Proposal, TokenMetaData, Token } from '@zero-tech/zdao-sdk';
import { ProposalState } from '@zero-tech/zdao-sdk';
import { isEmpty } from 'lodash';
import moment from 'moment';
import millify from 'millify';
import { toFiat } from 'lib/currency';
import { secondsToDhms } from 'lib/utils/datetime';
import { DEFAULT_TIMMER_EXPIRED_LABEL } from './Proposals.constants';

const MILLIFY_THRESHOLD = 1000000;
const MILLIFY_PRECISION = 3;

/**
 * Sort proposals by active & ending time
 * @param proposals to sort
 * @returns sorted proposals
 */
export const sortProposals = (proposals?: Proposal[]): Proposal[] => {
	if (!proposals) {
		return [];
	}

	// 1. Filter by date first
	const filteredProposals = proposals.filter(
		(p) => p.created.getTime() > 1653041437000, // After Fri May 20 2022 10:10:37 GMT+0000
	);

	// 2. Sort by state and endting time
	const closedProposals = filteredProposals.filter(
		(p) => p.state === ProposalState.CLOSED || moment(p.end).isBefore(moment()),
	);
	const activeProposals = filteredProposals.filter(
		(p) => !closedProposals.includes(p),
	);

	activeProposals.sort((a, b) =>
		moment(a.end).isAfter(moment(b.end)) ? 1 : -1,
	);

	closedProposals.sort((a, b) =>
		moment(a.end).isBefore(moment(b.end)) ? 1 : -1,
	);

	return [...activeProposals, ...closedProposals];
};

/**
 * Format the proposal body
 * @param body string to format
 * @returns formatted proposal bod
 */
export const formatProposalBody = (body: string = ''): string => {
	// 1. Convert ipfs:// formated image into https://snapshot image because snapshot image is not showing correctly
	let convertedBody = body;
	return convertedBody.replace(
		'ipfs://',
		'https://snapshot.mypinata.cloud/ipfs/',
	);
};

/**
 * Check if proposal is from snapshot and have multiple choices
 * @param proposal to check
 * @returns true if the proposal is from snapshot with multiple choices
 */
export const isFromSnapshotWithMultipleChoices = (
	proposal: Proposal,
): boolean => {
	/**
	 * 06/10/2022 Note - https://www.notion.so/zerotech/For-any-proposal-created-in-snapshot-display-the-Please-vote-on-this-proposal-in-Snapshot-footer-171742b056a445169bdaffe840d358a1
	 *
	 * To work around this in the MVP, lets just show the
	 * ‘‘Please vote on this proposal in Snapshot’ footer’ for ANY Snapshot proposals
	 *
	 */
	//  return !proposal.metadata && proposal.choices.length > 2;
	return !proposal.metadata;
};

/**
 * Get snapshot proposal link
 * @param proposal to get
 * @returns snapshot proposal link to vote
 */
export const getSnpashotProposalLink = (
	dao: zDAO,
	proposal: Proposal,
): string => {
	return `https://snapshot.org/#/${dao.ens}/proposal/${proposal.id}`;
};

/**
 * Format proposal status
 * @param proposal to format
 * @returns formatted proposal status string
 */
export const formatProposalStatus = (proposal?: Proposal): string => {
	if (proposal) {
		if (isFromSnapshotWithMultipleChoices(proposal)) {
			return '-';
		}

		const isClosed = proposal.state === ProposalState.CLOSED;

		if (!proposal.votes) return isClosed ? 'No Votes' : 'No Votes Yet';

		if (isEmpty(proposal.scores))
			return isClosed ? 'Expired' : 'More Votes Needed';

		if (proposal.scores[0] > proposal.scores[1]) {
			return isClosed ? 'Approved' : 'Approval Favoured';
		} else if (proposal.scores[0] < proposal.scores[1]) {
			return isClosed ? 'Denied' : 'Denial Favoured';
		} else {
			return 'More Votes Needed';
		}
	}

	return '';
};

/**
 * Format a time diff as humanized string
 * @param timeDiff to format
 * @returns formatted humanized string
 */
export const formatProposalEndTime = (timeDiff: number): string => {
	if (timeDiff < 0) {
		return DEFAULT_TIMMER_EXPIRED_LABEL;
	}

	return secondsToDhms(timeDiff / 1000);
};

/**
 * Format a voting power amount
 * @param amount to format
 * @param symbol voting token symbol
 * @returns formatted ammount of voting power
 */
export const formatVotingPowerAmount = (
	amount: number,
	token?: Token,
	showSymbol?: boolean,
): string | null => {
	if (!amount || !token) return null;

	const formattedAmount =
		amount >= MILLIFY_THRESHOLD
			? millify(amount, { precision: MILLIFY_PRECISION })
			: toFiat(amount, {
					maximumFractionDigits: 2,
					minimumFractionDigits: 0,
			  });

	const symbol =
		token.decimals > 0 ? token.symbol : 'NFT' + (amount > 1 ? 's' : '');

	return formattedAmount + (showSymbol ? ' ' + symbol : '');
};

/**
 * Format a total amount of proposal metadata
 * @param tokenMetaData to format
 * @returns formatted total ammount of proposal metadata
 */
export const formatTotalAmountOfTokenMetadata = (
	tokenMetaData?: TokenMetaData,
	asNumber: boolean = false,
): string | number | null => {
	if (!tokenMetaData) return null;

	const { amount, decimals } = tokenMetaData;

	if (!amount || !decimals) return null;

	const calculatedAmount = Math.min(
		Number(formatUnits(amount, decimals)),
		Number.MAX_SAFE_INTEGER,
	);

	if (!calculatedAmount) return null;

	if (asNumber) {
		return calculatedAmount;
	}

	const formattedAmount =
		calculatedAmount >= MILLIFY_THRESHOLD
			? millify(calculatedAmount, { precision: MILLIFY_PRECISION })
			: toFiat(calculatedAmount, {
					maximumFractionDigits: 2,
					minimumFractionDigits: 0,
			  });

	return formattedAmount + ' ' + tokenMetaData.symbol;
};

/**
 * Format a total amount in USD of proposal metadata
 * @param tokenMetaData to format
 * @returns formatted total ammount in USD of proposal metadata
 */
export const formatAmountInUSDOfTokenMetadata = (
	wildPriceUsd: number,
	tokenMetaData?: TokenMetaData,
): string | null => {
	const amountInWILD = formatTotalAmountOfTokenMetadata(tokenMetaData, true);

	if (!amountInWILD) return null;

	return '$' + toFiat(Number(amountInWILD) * wildPriceUsd);
};
