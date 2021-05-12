//- React Imports
import { useState, useEffect } from 'react'

//- Style Imports
import styles from './Notification.module.css'

type NotificationProps = {
    text: string;
}

const Notification: React.FC<NotificationProps> = ({ text }) => {

    return(
        <div className={`${styles.Notification} border-primary blur`}>
            <p>{text}</p>
        </div>
    )
}

export default Notification