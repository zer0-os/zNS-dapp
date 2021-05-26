//- React Imports
import React, { useState } from 'react';

//- Style Imports
import styles from './Tooltip.module.css';

type TooltipProps = {
	children: React.ReactNode;
	content: React.ReactNode;
};

const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
	// TODO: Make this way more generic
	// TODO: Reimplement window clicks

	const [open, setOpen] = useState(false);

	return (
		<div className={styles.Tooltip}>
			<div onClick={() => setOpen(!open)}>{children}</div>
			<div
				className={`${styles.Content} ${open ? styles.Open : styles.Closed}`}
			>
				{content}
			</div>
		</div>
	);
};

export default Tooltip;
