//- React Imports
import React, { useState } from 'react'

//- Style Imports
import styles from './NumberButton.module.css'

type NumberButtonProps = {
    number: number;
    onClick: () => void;
    rotating?: boolean;
}

const NumberButton: React.FC<NumberButtonProps> = ({ number, onClick, rotating }) => {
    return(
        <button 
            onClick={onClick}
            className={`${styles.NumberButton} ${rotating ? styles.Rotating : ''}`}
        >
            { number }
        </button>
    )
}

export default NumberButton