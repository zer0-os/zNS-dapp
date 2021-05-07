import React from 'react'

import styles from './TextInput.module.css'

// TODO: Implement max characters (props.max)
// TODO: Convert to TypeScript

const TextInput = (props) => {

  const handleChange = (text) => {
    if(props.onChange) props.onChange(text.target.value)
  }

  return (
    <>
      {props.multiline && (
        <textarea
          className={`${styles.TextInput} border-blue ${props.error ? styles.Error : ''}`}
          onChange={handleChange}
          style={{
            ...props.style,
            resize: props.resizable ? 'vertical' : 'none',
          }}
          placeholder={props.placeholder}
          value={props.text ? props.text : ''}
        />
      )}
      {!props.multiline && (
        <input
          type={props.type ? props.type : ''}
          className={`${styles.TextInput} border-blue ${props.error ? styles.Error : ''}`}
          onChange={handleChange}
          style={props.style}
          placeholder={props.placeholder}
          value={props.text ? props.text : ''}
        />
      )}
    </>
  );
}

export default TextInput