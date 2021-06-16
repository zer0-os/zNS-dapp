//- React Imports
import React from 'react';

//- Style Imports
import styles from './FilterButton.module.css';

//- Asset Imports
import icon from './assets/icon.svg';

type FilterButtonProps = {
	onClick: () => void;
	children?: React.ReactNode;
};

const FilterButton: React.FC<FilterButtonProps> = ({ onClick, children }) => {
	return (
		<button className={`${styles.Button} glow-text-white`} onClick={onClick}>
			<img alt="filter" src={icon} />
			<span>{children}</span>
		</button>
	);
};

export default FilterButton;
