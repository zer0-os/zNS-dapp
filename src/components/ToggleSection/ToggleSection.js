import React, { useState } from 'react'

import styles from './ToggleSection.module.css'

import arrow from './assets/arrow.svg'

const ToggleSection = (props) => {

    const [ isOpen, setOpen ] = useState(props.open ? true : false)

    const rotateCss = { transform: isOpen || props.open ? 'rotate(90deg)' : 'rotate(0deg)' }
    const contentCss = { display : isOpen || props.open ? 'block' : 'none' }

    const toggle = () => setOpen(props.open != undefined ? props.open : !isOpen)

    return(
        <div style={props.style} onClick={toggle} className={styles.ToggleSection}>
            <div className={styles.Header}>
                <img src={arrow} style={rotateCss} />
                <span className={`no-select`}>{ props.label }</span>
            </div>
            <div style={contentCss}>
                { props.children }
            </div>
        </div>
    )
}

export default ToggleSection