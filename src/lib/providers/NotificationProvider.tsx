import React, { useState, useCallback, useEffect } from 'react'

export const NotificationContext = React.createContext({
    notifications: [{text: ''}],
    addNotification: (text: string) => {},
    removeNotification: (notif: Notification) => {},
})

type NotificationProviderType = {
    children: React.ReactNode;
}

type Notification = {
    text: string;
}

const NotificationProvider: React.FC<NotificationProviderType> = ({ children }) => {
    const [ notifications, setNotifications ] = useState<Notification[]>([])
    const [ toRemove, setToRemove ] = useState<Notification | null>(null) // Notification which has just timed out

    const addNotification = (text: string) => {
        const n: Notification = {text: text}
        const notifs = [n].concat(notifications)
        setNotifications(notifs)
        setTimeout(() => setToRemove(n), 3000)
    }

    // Remove the timed-out notification
    useEffect(() => {
        if(toRemove) removeNotification(toRemove)
    }, [ toRemove ])

    const removeNotification = (notif: Notification) => {
        const notifs: Notification[] = notifications.filter(n => n.text != notif.text)
        setNotifications(notifs)
    }

    const contextValue = {
        notifications,
        addNotification: useCallback((text: string) => addNotification(text), [ notifications ]),
        removeNotification: useCallback((notif: Notification) => removeNotification(notif), [ notifications ]),
    }

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
        </NotificationContext.Provider>
    )

}

export default NotificationProvider