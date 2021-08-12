import React, { useState } from 'react';

import styles from './TextButton.module.css';

const TextButton = (props) => {
	const [selected, setSelected] = useState(false);

	const handleClick = () => {
		setSelected(!selected);
		if (props.onClick) props.onClick();
	};

	return (
		<button
			onClick={handleClick}
			className={`${styles.textButton} ${
				(props.toggleable && selected) || props.selected ? styles.selected : ''
			}`}
			style={props.style}
		>
			{props.children}
		</button>
	);
};

export default TextButton;
