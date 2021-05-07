import React, { useState } from 'react'

import styles from './IconButton.module.css'

type IconButtonProps = {
    toggleable?: boolean;
    iconUri: string;
    style?: React.CSSProperties;
    toggled?: boolean
    onClick: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ toggleable, toggled, iconUri, style, onClick }) => {

    const [ selected, setSelected ] = useState(false)

    const handleClick = () => {
        setSelected(!selected)
        if(onClick) onClick()
    }

    return(
        <button 
            style={style}
            onClick={handleClick}
            className={`${styles.iconButton} ${ toggleable && selected || toggled ? styles.selected : '' }`}
        >
            <img src={iconUri} />
        </button>
    )
}

export default IconButton