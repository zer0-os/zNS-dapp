import React from 'react';
import TextInput, { TextInputProps } from './TextInput';
import styles from './TextInput.module.scss';

interface TextInputWithTopPlaceHolderProps extends TextInputProps {
	topPlaceholder: string;
}

const TextInputWithTopPlaceHolder: React.FC<TextInputWithTopPlaceHolderProps> =
	({ topPlaceholder, ...props }) => {
		return (
			<div className={styles.TextInputTopPlaceholderWrapper}>
				<span className={styles.TopPlaceholder}>{topPlaceholder}</span>
				<TextInput {...props} className={styles.TextInputTopPlaceholder} />
			</div>
		);
	};

export default TextInputWithTopPlaceHolder;
