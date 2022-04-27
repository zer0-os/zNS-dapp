import React from 'react';
import { MarkDownEditor, MarkDownViewer } from 'components';

export const DAOCreate: React.FC = () => {
	return (
		<>
			<h2>Markdown Editor Example</h2>
			<MarkDownEditor text="" />

			<hr />

			<h2>Markdown Viewer Example</h2>
			<MarkDownViewer text="Hello World" />
		</>
	);
};

export default DAOCreate;
