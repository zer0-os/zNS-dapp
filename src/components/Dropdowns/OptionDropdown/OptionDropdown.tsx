//- React Imports
import React, { useState, useRef } from 'react';

// Library Imports
import { useOnClickOutside } from 'lib/hooks/useOnClickOutside';

//- Style Imports
import styles from './OptionDropdown.module.scss';

export type Option = {
	icon?: string | React.ReactNode;
	title: string;
	[key: string]: any;
};

type OptionDropdownProps = {
	options: Option[];
	selected?: Option;
	onSelect: (selection: Option) => void;
	children: React.ReactNode;
	className?: string;
	selectedClassName?: string;
	drawerStyle?: React.CSSProperties;
	disableSelection?: boolean;
};

const OptionDropdown: React.FC<OptionDropdownProps> = ({
	options,
	selected,
	onSelect,
	children,
	drawerStyle,
	disableSelection,
	className,
	selectedClassName,
}) => {
	//////////////////
	// State & Refs //
	//////////////////

	const [isOpen, setIsOpen] = useState(false);
	const wrapperRef = useRef<HTMLDivElement>(null);

	///////////////
	// Functions //
	///////////////

	const select = (option: Option) => {
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
				<ul style={drawerStyle} className={`${styles.Drawer} border-rounded`}>
					{options.map((o, index) => (
						<li
							className={
								selected === o && !disableSelection
									? `${styles.Selected} ${selectedClassName}`
									: ''
							}
							onClick={() => select(o)}
							key={index}
						>
							{o.icon && (
								<>
									{typeof o.icon === 'string' ? (
										<img src={o.icon} title={o.title} alt={o.title} />
									) : (
										<>{o.icon}</>
									)}
								</>
							)}
							<span>{o.title}</span>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default OptionDropdown;
