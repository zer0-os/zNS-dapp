//- React Imports
import { FutureButton } from 'components';
import React from 'react';

//- Style Imports
import styles from './Confirmation.module.css';

type ConfirmationProps = {
	onConfirm: () => void;
	onCancel: () => void;
	title?: string;
	cancelText?: string;
	confirmText?: string;
	children?: React.ReactNode;
};

const Confirmation: React.FC<ConfirmationProps> = (props) => {
	return (
		<div
			className={`${styles.Confirmation} blur border-primary border-rounded`}
		>
			<h2 className="glow-text-white">{props.title ?? 'Are you sure?'}</h2>
			<hr className="glow" />
			{props.children}
			<div className={styles.Buttons}>
				<FutureButton
					style={{ textTransform: 'uppercase' }}
					alt
					glow
					onClick={props.onCancel}
				>
					{props.cancelText ?? 'Cancel'}
				</FutureButton>
				<FutureButton
					style={{ textTransform: 'uppercase' }}
					glow
					onClick={props.onConfirm}
				>
					{props.confirmText ?? 'Continue'}
				</FutureButton>
			</div>
		</div>
	);
};

export default Confirmation;
