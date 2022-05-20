import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import styles from './MarkDown.module.scss';

type MarkDownViewerProps = {
	text?: string;
	className?: string;
};

export const MarkDownViewer: React.FC<MarkDownViewerProps> = ({
	text,
	className,
}) => {
	return (
		<div className={`${styles.MarkDownViewerContainer} ${className}`}>
			<MDEditor.Markdown linkTarget="_blank" source={text} />
		</div>
	);
};

export default MarkDownViewer;
