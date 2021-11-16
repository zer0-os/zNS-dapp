/* eslint-disable react-hooks/exhaustive-deps */
//- React Imports
import React, { useRef, useEffect } from 'react';

//- Library Imports
import autoHeight from 'autosize';

//- Style Imports
import styles from './TextInput.module.scss';

//- Local Imports
import { isAlphanumeric, isNumber } from './validation';

export type TextInputProps = {
	alphanumeric?: boolean; // No symbols
	autosize?: boolean;
	className?: string;
	error?: boolean;
	errorText?: string;
	lowercase?: boolean; // Lowercase only
	maxLength?: number;
	multiline?: boolean;
	numeric?: boolean; // Numbers only
	onChange: (text: string) => void;
	placeholder?: string;
	resizable?: boolean;
	style?: React.CSSProperties;
	text?: string;
	type?: string;
};

const TextInput: React.FC<TextInputProps> = ({
	alphanumeric,
	autosize,
	className,
	error,
	errorText,
	lowercase,
	maxLength,
	multiline,
	numeric,
	onChange,
	placeholder,
	resizable,
	style,
	text,
	type,
}) => {
	//////////////////
	// State & Data //
	//////////////////

	const textArea = useRef<HTMLTextAreaElement>(null);

	///////////////
	// Functions //
	///////////////

	const handleChange = (event: any) => {
		const newValue = event.target.value;
		if (validate(newValue) && onChange) {
			return onChange(format(event.target.value));
		}
	};

	const format = (str: string) => {
		if (lowercase) {
			return str.toLowerCase();
		}
		return str;
	};

	const validate = (str: string) => {
		if (maxLength && maxLength < str.length) return false;
		if (alphanumeric && !isAlphanumeric(str)) return false;
		if (numeric && !isNumber(str)) return false;
		return true;
	};

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		if (multiline && autosize && textArea.current) {
			autoHeight(textArea.current);
		}
	}, []);

	////////////
	// Render //
	////////////

	return (
		<>
			{multiline && (
				<textarea
					className={`${styles.TextInput} border-blue ${
						error ? styles.Error : ''
					} ${className || ''}`}
					ref={textArea}
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
					} ${className || ''}`}
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
