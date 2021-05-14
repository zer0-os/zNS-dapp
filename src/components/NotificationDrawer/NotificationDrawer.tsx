//- React Imports
import React, { useState, useEffect } from 'react'

//- Library Imports
import useNotification from 'lib/hooks/useNotification'

//- Component Imports
import { Notification } from 'components'

//- Style Imports
import styles from './NotificationDrawer.module.css'

const NotificationDrawer = () => {

    // TODO: Need to animate notifications coming in and out
    // TODO: Change to useMemo

    const [ visibleNotifications, setVisibleNotifications ] = useState<any>([])

    const { notifications, removeNotification } = useNotification()

    // TODO: Should move Notification type into a module so we don't have to use 'any'
    const remove = (o: any) => {
        removeNotification(o)
    }

    return (
        <div className={styles.NotificationDrawer}>
            <ul>
                {
                    notifications.map((o: any) => 
                        <li key={o.text + Math.random()}>
                            <Notification onClick={() => remove(o)} text={o.text} />
                        </li>
                    )
                }
            </ul>
        </div>
    )
}

export default NotificationDrawer