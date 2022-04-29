import React from 'react';
import { MarkDownEditor, MarkDownViewer } from 'components';

const sampleText = `
A simple markdown editor with preview, implemented with React.js and TypeScript.This React Component aims to provide a simple Markdown editor with syntax highlighting support.This is based on textarea encapsulation, so it does not depend on any modern code editors such as Acs, CodeMirror, Monaco etc.

### Features

- 📑 Indent line or selected text by pressing tab key, with customizable indentation.
- ♻️ Based on textarea encapsulation, does not depend on any modern code editors.
- 🚧 Does not depend on the (https://github.com/uiwjs/uiw) component library.
- 🚘 Automatic list on new lines.
- 😻 GitHub flavored markdown support.
- 🌒 Support dark-mode/night-mode **@v3.11.0+**.
- 💡 Support [next.js](https://github.com/uiwjs/react-md-editor/issues/52#issuecomment-848969341), [Use examples](#support-nextjs) in [next.js](https://nextjs.org/).
`;

export const CreateProposal: React.FC = () => {
	return (
		<>
			<h2>Markdown Editor Example</h2>
			<MarkDownEditor text="" />

			<hr />

			<h2>Markdown Viewer Example</h2>
			<MarkDownViewer text={sampleText} />
		</>
	);
};

export default CreateProposal;
