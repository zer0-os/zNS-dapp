//- React Imports
import React, { useEffect } from 'react'

//- Library Imports
import useNotification from 'lib/hooks/useNotification'

//- Component Imports
import { Notification } from 'components'

//- Style Imports
import styles from './NotificationDrawer.module.css'

const NotificationDrawer = () => {

    const { notifications } = useNotification()

    return (
        <div className={styles.NotificationDrawer}>
            <ul>
                {
                    notifications.map(({text}) => 
                        <Notification text={text} />
                    )
                }
            </ul>
        </div>
    )
}

export default NotificationDrawer