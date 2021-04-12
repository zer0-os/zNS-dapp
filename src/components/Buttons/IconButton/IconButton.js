import React, { useState } from 'react'

import styles from './IconButton.module.css'

const IconButton = (props) => {

    const [ selected, setSelected ] = useState(false)

    const handleClick = () => {
        setSelected(!selected)
    }

    return(
        <button 
            style={props.style}
            onClick={handleClick}
            className={`${styles.iconButton} ${ props.toggleable && selected ? styles.selected : '' }`}
        >
            <img src={props.icon} />
        </button>
    )
}

export default IconButton