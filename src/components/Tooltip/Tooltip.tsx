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
	const wrapperRef = useRef<HTMLDivElement>(null);

	const toggle = () => {
		setOpen(!open);
	};

	const toggleWindow = (event: Event) => {
		const t = event.target as HTMLElement;
		const w = wrapperRef.current;
		if (!t || !w) return;
		if (!w.contains(t)) setOpen(false);
	};

	useEffect(() => {
		if (open) window.addEventListener('click', toggleWindow);
		else window.removeEventListener('click', toggleWindow);
		return () => window.removeEventListener('click', toggleWindow);
	}, [open]);

	return (
		<div ref={wrapperRef} className={styles.Tooltip}>
			<div onClick={toggle}>{children}</div>
			<div
				className={`${styles.Content} ${open ? styles.Open : styles.Closed}`}
			>
				{content}
			</div>
		</div>
	);
};

export default Tooltip;
