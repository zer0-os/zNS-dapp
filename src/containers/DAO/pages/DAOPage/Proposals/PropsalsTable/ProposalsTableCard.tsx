import React from 'react';

// Components
import { Detail } from 'components';

// Styles
import styles from './ProposalsTableCard.module.scss';

// Types
import { Proposal, TokenMetaData } from '@zero-tech/zdao-sdk';

interface ProposalsTableCardProps {
	data: Proposal;
	onRowClick: () => void;
	className: string;
}

/**
 * A single grid item for the Proposals table
 */
// TODO:: should be styled and get token metadata and format the ammount (cc @Joon)
// TODO:: should implement timer with "end" date time (cc @Joon)
const ProposalsTableCard: React.FC<ProposalsTableCardProps> = ({
	data,
	onRowClick,
	className,
}) => {
	const { title, body } = data;

	return (
		<div className="make this card component">
			<Detail className={styles.AmountInUSD} text={title} subtext={body} />

			{/* TODO:: Should implement chicklets with prices, state and humanized time */}
		</div>
	);
};

export default ProposalsTableCard;
