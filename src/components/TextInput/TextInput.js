import React from 'react';

import styles from './TextInput.module.css';

// todo:
// - Implement max characters (props.max)

const TextInput = (props) => {

  const handleChange = (text) => {
    if(props.onChange) props.onChange(text.target.value)
  }

  return (
    <>
      {props.multiline && (
        <textarea
          className={`${styles.TextInput} border-blue`}
          onChange={handleChange}
          style={{
            ...props.style,
            resize: props.resizable ? 'vertical' : 'none',
          }}
          placeholder={props.placeholder}
        />
      )}
      {!props.multiline && (
        <input
          type={props.type ? props.type : ''}
          className={`${styles.TextInput} border-blue`}
          onChange={handleChange}
          style={props.style}
          placeholder={props.placeholder}
        />
      )}
    </>
  );
};

export default TextInput;
