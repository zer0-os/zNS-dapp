//- React Imports
import { FutureButton } from 'components';
import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator';
import { Maybe } from 'lib/types';
import React from 'react';

//- Style Imports
import styles from './Confirmation.module.css';

type ConfirmationProps = {
	cancelText?: string;
	children?: React.ReactNode;
	errorText?: string;
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
	errorText,
}) => {
	if (showLoading === undefined) showLoading = false; //if undefined its false

	let errorMessage: Maybe<React.ReactFragment>;

	if (errorText && errorText.length > 0) {
		errorMessage = (
			<p style={{ marginTop: '16px' }} className={styles.Error}>
				{`${errorText} Try again later.`}
			</p>
		);
	}

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
			{!hideButtons && !showLoading && errorText && <div>{errorMessage}</div>}
			{!hideButtons && showLoading && loadingText && (
				<div className={styles.Buttons}>
					<LoadingIndicator
						text={loadingText}
					/>
				</div>
			)}
		</div>
	);
};

export default Confirmation;
