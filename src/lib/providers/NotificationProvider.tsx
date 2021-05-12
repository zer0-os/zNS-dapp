import React, { useState, useCallback } from 'react'

export const NotificationContext = React.createContext({
    notifications: [{id: '', text: ''}],
    addNotification: (id: string, text: string) => {},
    removeNotification: (id: string) => {},
})

type NotificationProviderType = {
    children: React.ReactNode;
}

type Notification = {
    text: string;
    id: string;
}

const NotificationProvider: React.FC<NotificationProviderType> = ({ children }) => {
    const [ notifications, setNotifications ] = useState<Notification[]>([])

    const addNotification = (id: string, text: string) => {
        // const arr = notifications.unshift({id: id, text: text})
        // const notifs: Notification[] = notifications.unshift({id: id, text: text})
        setNotifications([])
    }

    const removeNotification = (id: string) => {
        // const notifs: Notification[] = notifications.filter(n => n.id !== id)
        setNotifications([])
    }

    const contextValue = {
        notifications,
        addNotification: useCallback((id: string, text: string) => addNotification(id, text), []),
        removeNotification: useCallback((id: string) => removeNotification(id), [])
    }

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
        </NotificationContext.Provider>
    )

}

export default NotificationProvider