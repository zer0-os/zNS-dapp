import React, { useState, useCallback } from 'react'

export const NotificationContext = React.createContext({
    notification: null,
    addNotification: (message) => {},
    removeNotification: () => {},
})

const NotificationProvider = ({ children }) => {
    const [ notification, setNotification ] = useState(null)

    const removeNotification = () => setNotification(null) 
    const addNotification = (message) => setNotification(message)

    const contextValue = {
        notification,
        addNotification: useCallback((message) => addNotification(message), []),
        removeNotification: useCallback(() => removeNotification(), [])
    }

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
        </NotificationContext.Provider>
    )
}

export default NotificationProvider