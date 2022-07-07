import React from 'react';
import styles from './Vote.module.scss';

type VoteButtonsProps = {
	onClickApprove: () => void;
	onClickDeny: () => void;
};

const VoteButtons: React.FC<VoteButtonsProps> = ({
	onClickApprove,
	onClickDeny,
}) => {
	return (
		<ul className={styles.Choices}>
			<li>
				<button onClick={onClickApprove}>
					<span className={styles.Approve}>Vote to Approve</span>
				</button>
			</li>
			<li>
				<button onClick={onClickDeny}>
					<span className={styles.Deny}>Vote to Deny</span>
				</button>
			</li>
		</ul>
	);
};

export default VoteButtons;

/*
 * Approve / Deny buttons
 */

export const Approve: React.FC = ({ children }) => (
	<span className={styles.Approve}>{children}</span>
);

export const Deny: React.FC = ({ children }) => (
	<span className={styles.Deny}>{children}</span>
);
