import React from 'react';
import MDEditor, { ICommand } from '@uiw/react-md-editor';
import { usePropsState } from 'lib/hooks/usePropsState';
import {
	MARKDOWN_EDITOR_MODES,
	MARKDOWN_EDITOR_TOOLBAR_TITLES,
} from './MarkDown.constants';
import styles from './MarkDown.module.scss';

type MarkDownEditorProps = {
	text?: string;
};

export const MarkDownEditor: React.FC<MarkDownEditorProps> = ({
	text = '',
}) => {
	const [value, setValue] = usePropsState<string>(text);

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
		<div className={styles.MarkDownEditorContainer}>
			<MDEditor
				value={value}
				onChange={(v: string = '') => setValue(v)}
				commandsFilter={onCommandsFilter}
				preview={MARKDOWN_EDITOR_MODES.EDIT}
			/>
		</div>
	);
};

export default MarkDownEditor;
