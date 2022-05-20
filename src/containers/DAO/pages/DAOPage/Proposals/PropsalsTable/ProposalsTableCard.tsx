import React, { useMemo, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

// Hooks
import useProposalMetadata from '../../hooks/useProposalMetadata';

// Lib
import moment from 'moment';
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
import { Proposal } from '@zero-tech/zdao-sdk';

// Constants
import { DEFAULT_TIMMER_EXPIRED_LABEL } from '../Proposals.constants';
import { CURRENCY } from 'constants/currency';
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

	const { metadata, isLoading: isMetadataLoading } = useProposalMetadata(data);

	const { id, title, body, end } = data;

	const cardData = useMemo(() => {
		const wild = formatTotalAmountOfTokenMetadata(metadata);
		const isConcluded = moment(end).isBefore(moment());
		const timeDiff = moment(end).diff(moment());

		let closingType: ChicletType = 'normal';
		if (!isConcluded && timeDiff < 24 * 3600 * 1000) {
			// less than 1 hour
			closingType = 'error';
		} else if (!isConcluded && timeDiff <= 24 * 3600 * 1000) {
			// less than 1 day
			closingType = 'warning';
		}

		return {
			wild: {
				value: wild,
				formatted: (wild || '0.00') + ' ' + CURRENCY.WILD,
			},
			closing: {
				type: closingType,
				message: isConcluded
					? DEFAULT_TIMMER_EXPIRED_LABEL
					: 'Closing in ' + moment.duration(timeDiff).humanize(),
			},
		};
	}, [metadata, end]);

	const handleCardClick = useCallback(() => {
		history.push(`${location.pathname}/${id}`);
		onRowClick && onRowClick();
	}, [onRowClick, history, location, id]);

	return (
		<div
			className={classNames(styles.Container, className)}
			onClick={handleCardClick}
		>
			<div className={styles.Content}>
				<h2 className={styles.Title}>{title}</h2>
				<p className={styles.Description}>{truncateString(body, 150)}</p>
			</div>
			<div className={styles.Buttons}>
				{!isMetadataLoading && cardData.wild.value && (
					<Chiclet>{cardData.wild.formatted}</Chiclet>
				)}
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
