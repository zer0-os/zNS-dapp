//- React Imports
import React, { useState } from 'react';

//- Style Imports
import styles from './OptionDropdown.module.css';

type OptionDropdownProps = {
	options: string[];
	onSelect: (selection: string) => void;
	children: React.ReactNode;
};

const OptionDropdown: React.FC<OptionDropdownProps> = ({
	options,
	onSelect,
	children,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selected, setSelected] = useState('');

	const toggle = () => {
		if (isOpen) close();
		else open();
	};

	const select = (option: string) => {
		if (option === selected) {
			setSelected('');
			onSelect('');
		} else {
			setSelected(option);
			onSelect(option);
		}
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
				<ul className={styles.Drawer}>
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
