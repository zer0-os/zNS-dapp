//- React Imports
import React, { useState, useEffect, useRef } from 'react';

//- Style Imports
import styles from './OptionDropdown.module.css';

type OptionDropdownProps = {
	options: string[];
	onSelect: (selection: string) => void;
	children: React.ReactNode;
	drawerStyle?: React.CSSProperties;
};

const OptionDropdown: React.FC<OptionDropdownProps> = ({
	options,
	onSelect,
	children,
	drawerStyle,
}) => {
	//////////////////
	// State & Refs //
	//////////////////

	const [isOpen, setIsOpen] = useState(false);
	const [selected, setSelected] = useState(options[0] || '');
	const wrapperRef = useRef<HTMLUListElement>(null);

	///////////////
	// Functions //
	///////////////

	const select = (option: string) => {
		setSelected(option);
		onSelect(option);
		close();
	};

	const open = () => {
		setIsOpen(true);
	};

	const close = () => {
		setIsOpen(false);
	};

	// Toggles the visibility of the drawer
	const toggle = () => {
		if (isOpen) close();
		else open();
	};

	// Toggles the visibility of the drawer on window click
	const toggleWindow = (event: Event) => {
		const t = event.target as HTMLElement;
		const w = wrapperRef.current;
		if (!t || !w) return;
		setIsOpen(w.contains(t));
	};

	/////////////
	// Effects //
	/////////////

	// Adds window click listener when opened, removes it when closed
	useEffect(() => {
		if (isOpen) window.addEventListener('click', toggleWindow);
		else window.removeEventListener('click', toggleWindow);
		return () => window.removeEventListener('click', toggleWindow);
	}, [isOpen]);

	return (
		<div className={styles.Dropdown}>
			<div className={styles.Header} onClick={toggle}>
				{children}
			</div>
			{isOpen && (
				<ul
					ref={wrapperRef}
					style={drawerStyle}
					className={`${styles.Drawer} blur`}
				>
					{options.map((o) => (
						<li
							className={selected === o ? styles.Selected : ''}
							onClick={() => select(o)}
							key={o}
						>
							{o}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default OptionDropdown;
