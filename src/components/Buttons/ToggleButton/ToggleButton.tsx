//- React Imports
import React from 'react'

//- Style Imports
import styles from './ToggleButton.module.css'

type ToggleButtonProps = {
    toggled: boolean;
    style?: React.CSSProperties;
    onClick: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ toggled, style, onClick }) => {
    return(
        <div className={`${styles.Toggle} ${toggled ? styles.On : ''}`}>
            <div></div>
        </div>
    )
}

export default ToggleButton