//- React Imports
import React, { useState, useEffect, useRef } from 'react';

//- Style Imports
import styles from './Tooltip.module.css';

type TooltipProps = {
	children: React.ReactNode;
	content: React.ReactNode;
};

const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
	// TODO: Make this way more generic

	const [open, setOpen] = useState(false);
	// const contentRef = useRef()

	const toggle = () => {
		setOpen(!open);
	};

	// TODO: Reimplement window clicks

	// useEffect(() => {
	//     if(open) {
	//         window.addEventListener('click', windowClick)
	//     } else {
	//         window.removeEventListener('click', windowClick)
	//     }
	// }, [ open] )

	// const windowClick = (e: any) => {
	// const contains = !e.target.contains(contentRef.current)
	// if(!contains) setOpen(false)
	// }

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
