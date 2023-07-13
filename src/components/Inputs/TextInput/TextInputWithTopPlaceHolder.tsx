import React from 'react';
import classNames from 'classnames';
import TextInput, { TextInputProps } from './TextInput';
import styles from './TextInput.module.scss';

interface TextInputWithTopPlaceHolderProps extends TextInputProps {
	topPlaceholder: string;
	className?: string;
	shouldRenderTopPlaceHolder?: boolean;
}

const cx = classNames.bind(styles);

const TextInputWithTopPlaceHolder: React.FC<
	TextInputWithTopPlaceHolderProps
> = ({
	topPlaceholder,
	className = '',
	shouldRenderTopPlaceHolder = true,
	...props
}) => {
	return (
		<div
			className={classNames(styles.TextInputTopPlaceholderWrapper, className)}
		>
			{shouldRenderTopPlaceHolder && (
				<span className={styles.TopPlaceholder}>{topPlaceholder}</span>
			)}
			<TextInput
				{...props}
				className={cx(styles.TextInputTopPlaceholder, {
					Active: shouldRenderTopPlaceHolder,
				})}
			/>
		</div>
	);
};

export default TextInputWithTopPlaceHolder;
