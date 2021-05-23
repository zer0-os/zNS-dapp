import React from 'react'

import styles from './StepBar.module.css'

const StepBar = (props) => {

    const translate = () => (props.step >= props.steps.length ? ((props.steps.length - 1) * 100) + '%' : ((props.step - 1) * 100) + '%')
    const width = () => `${1/props.steps.length * 100}%`
    const left = (i: number) => `${i/props.steps.length * 100}%`

    const currText = () => {

    }

    const text = (step: string, i: number) => `Step ${i + 1} of ${props.steps.length}: ${step}`

    return (
        <div style={props.style} className={styles.StepBar}>
            { props.steps.map((s: string, i: number) => 
                <div 
                    className={`${styles.Placeholder} ${props.step - 1 > i ? styles.Show : ''}`} 
                    style={{position: 'absolute', left: left(i), width: width()}}>
                        { text(s, i) }
                </div>
            ) }
            <div 
                style={{width: width(), transform: `translateX(${translate()})`}}
                className={styles.Bar}
            >
                Step{' '}
                    {props.step >= props.steps.length ? props.steps.length : props.step} 
                {' '}of{' '}
                    {props.steps.length}: {props.steps[props.step - 1]}
            </div>
        </div>
    )
}

export default StepBar