import React from 'react'

import styles from './StepBar.module.css'

const StepBar = (props) => {

    const getWidth = () =>  (props.step >= props.steps ? '100%' : `${100 * (props.step / props.steps)}%`)

    return (
        <div style={props.style} className={styles.StepBar}>
            <div style={{width: getWidth()}} className={styles.Bar}>
                Step {props.step >= props.steps ? props.steps : props.step} of {props.steps}
            </div>
        </div>
    )
}

export default StepBar