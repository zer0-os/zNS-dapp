import { useContext } from 'react';
import { NotificationContext } from 'lib/providers/NotificationProvider';

function useNotification() {
	const { notifications, addNotification, removeNotification } =
		useContext(NotificationContext);
	return { notifications, addNotification, removeNotification };
}

export default useNotification;
