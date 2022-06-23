import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import { REMARK_PLUGINS } from './MarkDown.plugins';
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
			<MDEditor.Markdown
				linkTarget="_blank"
				source={text}
				remarkPlugins={REMARK_PLUGINS}
			/>
		</div>
	);
};

export default MarkDownViewer;
