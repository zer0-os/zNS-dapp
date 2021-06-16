//- React Imports
import React, { useState } from 'react';

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
	const [isOpen, setIsOpen] = useState(false);
	const [selected, setSelected] = useState('');

	const toggle = () => {
		if (isOpen) close();
		else open();
	};

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

	return (
		<div className={styles.Dropdown}>
			<div className={styles.Header} onClick={toggle}>
				{children}
			</div>
			{isOpen && (
				<ul style={drawerStyle} className={styles.Drawer}>
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
