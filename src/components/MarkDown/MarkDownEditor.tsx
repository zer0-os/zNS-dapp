import React from 'react';
import classNames from 'classnames/bind';
import MDEditor, { ICommand } from '@uiw/react-md-editor';
import {
	MARKDOWN_EDITOR_MODES,
	MARKDOWN_EDITOR_TOOLBAR_TITLES,
} from './MarkDown.constants';
import styles from './MarkDown.module.scss';

type MarkDownEditorProps = {
	text?: string;
	placeholder?: string;
	containerClassName?: string;
	onChange?: (value?: string) => void;
	errorText?: string;
};

export const MarkDownEditor: React.FC<MarkDownEditorProps> = ({
	text = '',
	placeholder,
	containerClassName = '',
	onChange,
	errorText = '',
}) => {
	const onCommandsFilter = (command: ICommand<string>) => {
		switch (command.name) {
			case MARKDOWN_EDITOR_MODES.LIVE:
				return false;

			case MARKDOWN_EDITOR_MODES.EDIT:
				return {
					...command,
					buttonProps: {
						...command.buttonProps,
						className: styles.CustomTextToolbarButton,
					},
					icon: (
						<>{MARKDOWN_EDITOR_TOOLBAR_TITLES[MARKDOWN_EDITOR_MODES.EDIT]}</>
					),
				};

			case MARKDOWN_EDITOR_MODES.PREVIEW:
				return {
					...command,
					buttonProps: {
						...command.buttonProps,
						className: styles.CustomTextToolbarButton,
					},
					icon: (
						<>{MARKDOWN_EDITOR_TOOLBAR_TITLES[MARKDOWN_EDITOR_MODES.PREVIEW]}</>
					),
				};

			default:
				return command;
		}
	};

	return (
		<div
			className={classNames(styles.MarkDownEditorContainer, containerClassName)}
		>
			<MDEditor
				value={text}
				onChange={onChange}
				commandsFilter={onCommandsFilter}
				preview={MARKDOWN_EDITOR_MODES.EDIT}
				textareaProps={{
					placeholder,
				}}
			/>
			{errorText && (
				<span className={classNames(styles.ErrorMessage)}>{errorText}</span>
			)}
		</div>
	);
};

export default MarkDownEditor;
