//- React Imports
import React from 'react';

//- Style Imports
import styles from './TextInput.module.css';

//- Local Imports
import { isAlphanumeric, isNumber } from './validation';

// TODO: Implement max characters (props.max)
// TODO: Convert to TypeScript

type TextInputProps = {
	onChange: (text: string) => void;
	error?: boolean;
	errorText?: string;
	placeholder?: string;
	type?: string;
	text?: string;
	multiline?: boolean;
	style?: React.CSSProperties;
	resizable?: boolean;
	alphanumeric?: boolean; // If we want only alphanumeric characters
	numeric?: boolean;
};

const TextInput: React.FC<TextInputProps> = ({
	onChange,
	error,
	errorText,
	placeholder,
	type,
	text,
	multiline,
	style,
	resizable,
	alphanumeric,
	numeric,
}) => {
	const handleChange = (event: any) => {
		const newValue = event.target.value;
		if (validate(newValue) && onChange) return onChange(event.target.value);
	};

	const validate = (str: string) => {
		if (alphanumeric && !isAlphanumeric(str)) return false;
		if (numeric && !isNumber(str)) return false;
		return true;
	};

	return (
		<>
			{multiline && (
				<textarea
					className={`${styles.TextInput} border-blue ${
						error ? styles.Error : ''
					}`}
					onChange={handleChange}
					style={{
						...style,
						resize: resizable ? 'vertical' : 'none',
					}}
					placeholder={placeholder}
					value={text ? text : ''}
				/>
			)}
			{!multiline && (
				<input
					type={type ? type : ''}
					className={`${styles.TextInput} border-blue ${
						error ? styles.Error : ''
					}`}
					onChange={handleChange}
					style={style}
					placeholder={placeholder}
					value={text ? text : ''}
				/>
			)}
			{error && errorText && (
				<span className={styles.ErrorMessage}>{errorText}</span>
			)}
		</>
	);
};

export default TextInput;
