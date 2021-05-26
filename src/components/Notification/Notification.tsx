//- Style Imports
import styles from './Notification.module.css';

type NotificationProps = {
	text: string;
	onClick?: () => void;
};

const Notification: React.FC<NotificationProps> = ({ text, onClick }) => {
	return (
		<div
			onClick={onClick}
			className={`${styles.Notification} blur ${
				onClick ? styles.Clickable : ''
			}`}
		>
			<p>{text}</p>
		</div>
	);
};

export default Notification;
