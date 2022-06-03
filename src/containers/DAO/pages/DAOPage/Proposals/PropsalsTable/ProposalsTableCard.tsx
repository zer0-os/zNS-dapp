import React, { useMemo, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

// Lib
import moment from 'moment';
import { isEmpty } from 'lodash';
import removeMarkdown from 'markdown-to-text';
import {
	formatProposalStatus,
	formatTotalAmountOfTokenMetadata,
} from '../Proposals.helpers';
import { truncateString } from 'lib/utils/string';

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
	const history = useHistory();
	const location = useLocation();

	const { id, title, body, end, metadata } = data;

	const cardData = useMemo(() => {
		const amount = formatTotalAmountOfTokenMetadata(metadata);
		const isConcluded = moment(end).isBefore(moment());
		const timeDiff = moment(end).diff(moment());

		let closingType: ChicletType = 'normal';
		if (!isConcluded && timeDiff < 1 * 3600 * 1000) {
			// less than 1 hour
			closingType = 'error';
		} else if (!isConcluded && timeDiff <= 24 * 3600 * 1000) {
			// less than 1 day
			closingType = 'warning';
		}

		return {
			amount,
			closing: {
				type: closingType,
				message: isConcluded
					? DEFAULT_TIMMER_EXPIRED_LABEL
					: 'Closing in ' + moment.duration(timeDiff).humanize(),
			},
		};
	}, [metadata, end]);

	const handleCardClick = useCallback(() => {
		history.push(`${location.pathname}/${id}`, {
			[PROPOSAL_TABLE_LOCATION_STATE_KEY]: PROPOSAL_TABLE_LOCATION_STATE.CARD,
		});
		onRowClick && onRowClick();
	}, [onRowClick, history, location, id]);

	return (
		<div
			className={classNames(styles.Container, className)}
			onClick={handleCardClick}
		>
			<div className={styles.Content}>
				<h2 className={styles.Title}>{title}</h2>
				<p className={styles.Description}>
					{truncateString(removeMarkdown(body), 180)}
				</p>
			</div>
			<div className={styles.Buttons}>
				{!isEmpty(cardData.amount) && <Chiclet>{cardData.amount}</Chiclet>}
				<Chiclet type={cardData.closing.type}>
					{cardData.closing.message}
				</Chiclet>
				<Chiclet className={styles.Status}>
					{formatProposalStatus(data)}
				</Chiclet>
			</div>
		</div>
	);
};

export default ProposalsTableCard;
