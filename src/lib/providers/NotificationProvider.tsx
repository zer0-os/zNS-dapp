import React, { useState, useCallback } from 'react'

export const NotificationContext = React.createContext({
    notifications: [{text: ''}],
    addNotification: (text: string) => {},
})

type NotificationProviderType = {
    children: React.ReactNode;
}

type Notification = {
    text: string;
}

const NotificationProvider: React.FC<NotificationProviderType> = ({ children }) => {
    const [ notifications, setNotifications ] = useState<Notification[]>([])

    const addNotification = (text: string) => {
        const n: Notification = {text: text}
        console.log('add', n)
        console.log('curr', notifications)
        console.log('result', [n].concat(notifications))
        setNotifications([n].concat(notifications))
        // setTimeout(() => removeNotification(n), 5000)
    }

    const removeNotification = (n: Notification) => {
        const notifs: Notification[] = notifications.filter(m => m == n)
        setNotifications(notifs)
    }

    const contextValue = {
        notifications,
        addNotification: useCallback((text: string) => addNotification(text), [ notifications ]),
    }

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
        </NotificationContext.Provider>
    )

}

export default NotificationProvider