import { useState, useEffect } from 'react'
import useNotification from '../../lib/hooks/useNotification'

import styles from './Notification.module.css'

const Notification = () => {
    const { notification, removeNotification } = useNotification()

    const [ text, setText ] = useState<string>('')

    useEffect(() => {
        if(!notification && text.length) return
        setText('' + notification)
    }, [notification])

    return(
        <>
        <div className={`${styles.Notification} border-primary ${!notification ? styles.Hidden : ''}`}>
            { text }
        </div>
        </>
    )
}

export default Notification