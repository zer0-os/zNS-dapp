import { useContext } from 'react'
import { NotificationContext } from 'lib/providers/NotificationProvider'

function useNotification() {
    const { notifications, addNotification } = useContext(NotificationContext)
    return { notifications, addNotification }
}

export default useNotification