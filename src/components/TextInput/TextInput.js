import React from 'react'

import styles from './TextInput.module.css'

// todo: 
// - Implement max characters (props.max)

const TextInput = (props) => {
    return (
        <>
            { props.multiline && 
                <textarea
                    className={`${styles.TextInput} border-blue`}
                    style={{...props.style, resize: props.resizable ? 'vertical' : 'none'}}
                    placeholder={props.placeholder}
                />
            }
            { !props.multiline && 
                <input
                    className={`${styles.TextInput} border-blue`}
                    style={props.style}
                    placeholder={props.placeholder}
                />
            }
        </>
    )
}

export default TextInput