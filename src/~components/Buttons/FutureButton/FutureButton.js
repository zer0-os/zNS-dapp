import React, { useState } from 'react'

import styles from './FutureButtonStyle.module.css'

/*
 * Props:
 * - click { function } - Callback for click events
 * - toggleable { boolean } - Whether or not the button should have a 'selected' state 
 */

const FutureButton = (props) => {

    const [ hasHovered, setHovered ] = useState(false)
    const [ isSelected, setSelected ] = useState(false)

    const handleHover = () => {
        setHovered(true)
    }

    const handleClick = (e) => {
        if(props.onClick) props.onClick(e)
        else if(props.click) props.click(e) // Legacy
        if(props.togglable) setSelected(!isSelected)
    }

    return (
        <button 
            className={`${styles.futureButton} ${isSelected ? styles.selected : ''} ${props.glow ? styles.glow : ''}`}
            onMouseEnter={handleHover}
            onMouseUp={handleClick}
            style={props.style}
        >
            { props.icon && <div className={styles.iconImage}></div>}
            <div className={styles.content}>
                { props.children }
            </div>
            <div className={`${styles.wash} ${hasHovered && !isSelected ? styles.hovered : ''}`}></div>
            { props.icon && <div className={styles.iconImage}></div>}
        </button>
    )
}

export default FutureButton