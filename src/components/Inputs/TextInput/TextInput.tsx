/* eslint-disable react-hooks/exhaustive-deps */
//- React Imports
import React, { useRef, useEffect } from 'react';

//- Library Imports
import autoHeight from 'autosize';

//- Style Imports
import styles from './TextInput.module.scss';
import classNames from 'classnames';

//- Local Imports
import { isAlphanumeric, isNumber } from './validation';

type TextInputProps = {
	alphanumeric?: boolean; // No symbols
	autosize?: boolean;
	className?: string;
	disabled?: boolean;
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

const cx = classNames.bind(styles);

const TextInput: React.FC<TextInputProps> = ({
	alphanumeric,
	autosize,
	className,
	disabled,
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
					className={cx(className, styles.TextInput, 'border-blue', {
						Error: error,
					})}
					ref={textArea}
					onChange={handleChange}
					style={{
						...style,
						resize: resizable ? 'vertical' : 'none',
					}}
					placeholder={placeholder}
					value={text ? text : ''}
					disabled={disabled}
				/>
			)}
			{!multiline && (
				<input
					type={type ? type : ''}
					className={cx(className, styles.TextInput, 'border-blue', {
						Error: error,
					})}
					onChange={handleChange}
					style={style}
					placeholder={placeholder}
					value={text ? text : ''}
					disabled={disabled}
				/>
			)}
			{error && errorText && (
				<span className={styles.ErrorMessage}>{errorText}</span>
			)}
		</>
	);
};

export default TextInput;
