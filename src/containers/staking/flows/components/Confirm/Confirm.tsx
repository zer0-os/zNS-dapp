import { FutureButton } from 'components';
import styles from './Confirm.module.scss';

type ConfirmProps = {
	cancelText?: string;
	confirmText?: string;
	content: React.ReactNode;
	hideCancel?: boolean;
	onCancel?: () => void;
	onConfirm: () => void;
};

const Confirm = ({
	cancelText = 'Cancel',
	confirmText = 'Confirm',
	content,
	hideCancel,
	onCancel,
	onConfirm,
}: ConfirmProps) => (
	<div className={styles.Container + ' width-full'}>
		{content}
		<ul className={styles.Buttons}>
			{!hideCancel && (
				<li>
					<FutureButton alt glow onClick={onCancel}>
						{cancelText}
					</FutureButton>
				</li>
			)}
			<li>
				<FutureButton glow onClick={onConfirm}>
					{confirmText}
				</FutureButton>
			</li>
		</ul>
	</div>
);

export default Confirm;
