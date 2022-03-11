//- Style Imports
import styles from './Notification.module.scss';

type NotificationProps = {
	text: string;
	onClick?: () => void;
};

const Notification: React.FC<NotificationProps> = ({ text, onClick }) => {
	return (
		<div
			onClick={onClick}
			className={`${styles.Notification} background-primary blur ${
				onClick ? styles.Clickable : ''
			}`}
		>
			<p>{text}</p>
		</div>
	);
};

export default Notification;
