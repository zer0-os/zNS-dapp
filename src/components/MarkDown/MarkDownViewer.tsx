import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import styles from './MarkDown.module.scss';

type MarkDownViewerProps = {
	text?: string;
};

export const MarkDownViewer: React.FC<MarkDownViewerProps> = ({ text }) => {
	return (
		<div className={styles.MarkDownViewerContainer}>
			<MDEditor.Markdown source={text} />
		</div>
	);
};

export default MarkDownViewer;
