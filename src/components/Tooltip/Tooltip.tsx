//- React Imports
import React, { useState } from 'react'

//- Style Imports
import styles from './Tooltip.module.css'

type TooltipProps = {
    children: React.ReactNode;
    content: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {

    // TODO: Make this way more generic

    const [ open, setOpen ] = useState(false)

    return (
        <div 
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            className={styles.Tooltip}
        >
            <div>
            {children}
            </div>
            <div onMouseEnter={() => setOpen(true)} className={`${styles.Content} ${open ? styles.Open : styles.Closed}`}>
                {content}
            </div>
        </div>
    )
}

export default Tooltip