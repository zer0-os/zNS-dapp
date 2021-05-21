import React from 'react'

import styles from './StepBar.module.css'

const StepBar = (props) => {

    const getWidth = () =>  (props.step >= props.steps.length ? '100%' : `${100 * (props.step / props.steps.length)}%`)

    return (
        <div style={props.style} className={styles.StepBar}>
            <div style={{width: getWidth()}} className={styles.Bar}>
                Step {props.step >= props.steps.length ? props.steps.length : props.step} of {props.steps.length}: {props.steps[props.step - 1]}
            </div>
        </div>
    )
}

export default StepBar