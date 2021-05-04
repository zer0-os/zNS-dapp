import React, { useState } from 'react'

import styles from './FutureButtonStyle.module.css'

type FutureButtonProps = {
    onClick: () => void;
    style?: React.CSSProperties;
    toggleable?: boolean;
    children: React.ReactNode;
    glow?: boolean;
}

const FutureButton: React.FC<FutureButtonProps> = ({onClick, style, toggleable, children, glow}) => {

    const [ hasHovered, setHovered ] = useState(false)
    const [ isSelected, setSelected ] = useState(false)

    const handleHover = () => {
        setHovered(true)
    }

    const handleClick = () => {
        if(onClick) onClick()
        if(toggleable) setSelected(!isSelected)
    }

    return (
        <button 
            className={`${styles.futureButton} ${isSelected ? styles.selected : ''} ${glow ? styles.glow : ''}`}
            onMouseEnter={handleHover}
            onMouseUp={handleClick}
            style={style}
        >
            <div className={styles.content}>
                { children }
            </div>
            <div className={`${styles.wash} ${hasHovered && !isSelected ? styles.hovered : ''}`}></div>
        </button>
    )
}

export default FutureButton