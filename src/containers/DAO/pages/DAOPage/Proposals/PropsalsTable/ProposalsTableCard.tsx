import React, { useMemo, useCallback, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

// Lib
import moment from 'moment';
import { isEqual } from 'lodash';
import removeMarkdown from 'markdown-to-text';
import { truncateString } from 'lib/utils/string';
import { formatProposalStatus } from '../Proposals.helpers';

// Hooks
import { useDidMount } from 'lib/hooks/useDidMount';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { usePrevious } from 'lib/hooks/usePrevious';
import { useProposals } from 'lib/dao/providers/ProposalsProvider';

// Components
import { Chiclet } from 'components';

// Styles
import classNames from 'classnames';
import styles from './ProposalsTableCard.module.scss';

// Types
import type { Proposal } from '@zero-tech/zdao-sdk';

// Constants
import {
	DEFAULT_TIMMER_EXPIRED_LABEL,
	PROPOSAL_TABLE_LOCATION_STATE_KEY,
	PROPOSAL_TABLE_LOCATION_STATE,
} from '../Proposals.constants';
import { ChicletType } from 'components/Chiclet/Chiclet';

interface ProposalsTableCardProps {
	data: Proposal;
	onRowClick: () => void;
	className: string;
}

const ProposalsTableCard: React.FC<ProposalsTableCardProps> = ({
	data,
	onRowClick,
	className,
}) => {
	/**
	 * Hooks and Data
	 */
	const { updateProposal } = useProposals();

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [proposal, setProposal] = useState<Proposal>(data);
	const prevProposal = usePrevious<Proposal>(proposal);

	const history = useHistory();
	const location = useLocation();

	const cardData = useMemo(() => {
		const isConcluded = moment(proposal.end).isBefore(moment());
		const timeDiff = moment(proposal.end).diff(moment());
		const status = formatProposalStatus(isLoading ? data : proposal) || '-';

		let closingType: ChicletType = 'normal';
		if (!isConcluded && timeDiff < 1 * 3600 * 1000) {
			// less than 1 hour
			closingType = 'error';
		} else if (!isConcluded && timeDiff <= 24 * 3600 * 1000) {
			// less than 1 day
			closingType = 'warning';
		}

		return {
			isConcluded,
			closing: {
				type: closingType,
				message: isConcluded
					? DEFAULT_TIMMER_EXPIRED_LABEL
					: 'Closing in ' + moment.duration(timeDiff).humanize(),
			},
			status,
		};
	}, [proposal, isLoading, data]);

	/**
	 * Callbacks
	 */
	const refetchProposalData = useCallback(async () => {
		if (proposal.state !== 'closed') {
			setIsLoading(true);
			try {
				const updatedProposal = await proposal.updateScoresAndVotes();
				setProposal(updatedProposal);
			} catch (e) {
				console.error(e);
			} finally {
				setIsLoading(false);
			}
		}
	}, [proposal, setProposal]);

	const handleCardClick = useCallback(() => {
		history.push(`${location.pathname}/${proposal.id}`, {
			[PROPOSAL_TABLE_LOCATION_STATE_KEY]: PROPOSAL_TABLE_LOCATION_STATE.CARD,
		});
		onRowClick && onRowClick();
	}, [onRowClick, history, location, proposal]);

	/**
	 * Life Cycle
	 */
	useDidMount(refetchProposalData);

	useUpdateEffect(() => {
		if (!isEqual(proposal, prevProposal)) {
			updateProposal(proposal);
		}
	}, [proposal, prevProposal]);

	useUpdateEffect(() => {
		if (cardData.isConcluded) {
			updateProposal(proposal);
		}
	}, [cardData.isConcluded]);

	return (
		<div
			className={classNames(styles.Container, className)}
			onClick={handleCardClick}
		>
			<div className={styles.Content}>
				<h2 className={styles.Title}>{proposal.title}</h2>
				<p className={styles.Description}>
					{truncateString(removeMarkdown(proposal.body), 180)}
				</p>
			</div>
			<div className={styles.Buttons}>
				<Chiclet type={cardData.closing.type}>
					{cardData.closing.message}
				</Chiclet>
				{cardData.status !== '-' && (
					<Chiclet className={styles.Status}>{cardData.status}</Chiclet>
				)}
			</div>
		</div>
	);
};

export default ProposalsTableCard;
