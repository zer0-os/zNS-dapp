//- React Imports
import { FutureButton } from 'components';
import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator';
import React from 'react';

//- Style Imports
import styles from './Confirmation.module.css';

type ConfirmationProps = {
	cancelText?: string;
	children?: React.ReactNode;
	confirmText?: string;
	showLoading?: boolean;
	loadingText?: string;
	hideButtons?: boolean;
	onCancel: () => void;
	onConfirm: () => void;
	title?: string;
};

const Confirmation: React.FC<ConfirmationProps> = ({
	cancelText,
	children,
	confirmText,
	showLoading,
	loadingText,
	hideButtons,
	onCancel,
	onConfirm,
	title,
}) => {
	if (showLoading === undefined) showLoading = false; //if undefined its false

	return (
		<div
			className={`${styles.Confirmation} blur border-primary border-rounded`}
		>
			<h2 className="glow-text-white">{title ?? 'Are you sure?'}</h2>
			<hr className="glow" />
			{children}
			{!hideButtons && !showLoading && (
				<div className={styles.Buttons}>
					<FutureButton
						style={{ textTransform: 'uppercase' }}
						alt
						glow
						onClick={onCancel}
					>
						{cancelText ?? 'Cancel'}
					</FutureButton>
					<FutureButton
						style={{ textTransform: 'uppercase' }}
						glow
						onClick={onConfirm}
					>
						{confirmText ?? 'Continue'}
					</FutureButton>
				</div>
			)}
			{!hideButtons && showLoading && loadingText && (
				<div className={styles.Buttons}>
					<LoadingIndicator
						style={{ textTransform: 'uppercase' }}
						text={loadingText}
					/>
				</div>
			)}
		</div>
	);
};

export default Confirmation;
