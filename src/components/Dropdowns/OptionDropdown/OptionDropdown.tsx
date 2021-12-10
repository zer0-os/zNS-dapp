//- React Imports
import React, { useState, useRef } from 'react';

// Library Imports
import { useOnClickOutside } from 'lib/hooks/useOnClickOutside';

//- Style Imports
import styles from './OptionDropdown.module.scss';

export type Option = {
	icon?: string;
	title: string;
};

type OptionDropdownProps = {
	options: Option[];
	onSelect: (selection: Option) => void;
	children: React.ReactNode;
	className?: string;
	drawerStyle?: React.CSSProperties;
};

const OptionDropdown: React.FC<OptionDropdownProps> = ({
	options,
	onSelect,
	children,
	className,
	drawerStyle,
}) => {
	//////////////////
	// State & Refs //
	//////////////////

	const [isOpen, setIsOpen] = useState(false);
	const [selected, setSelected] = useState<Option>(options[0] || '');
	const wrapperRef = useRef<HTMLDivElement>(null);

	///////////////
	// Functions //
	///////////////

	const select = (option: Option) => {
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

	/////////////
	// Effects //
	/////////////

	useOnClickOutside(wrapperRef, close);

	return (
		<div className={`${styles.Dropdown} ${className}`} ref={wrapperRef}>
			<div className={styles.Header} onClick={toggle}>
				{children}
			</div>
			{isOpen && (
				<ul style={drawerStyle} className={`${styles.Drawer} blur`}>
					{options.map((o, index) => (
						<li
							className={selected === o ? styles.Selected : ''}
							onClick={() => select(o)}
							key={index}
						>
							{o.icon && <img src={o.icon} title={o.title} alt={o.title} />}
							<span>{o.title}</span>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default OptionDropdown;
