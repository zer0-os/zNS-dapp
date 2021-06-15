//- React Imports
import React from 'react';

//- Style Imports
import styles from './FilterButton.module.css';

//- Asset Imports
import icon from './assets/icon.svg';

type FilterButtonProps = {
	onClick: () => void;
};

const FilterButton: React.FC<FilterButtonProps> = ({ onClick }) => {
	return (
		<button className={`${styles.Button} glow-text-white`} onClick={onClick}>
			<img src={icon} />
			<span>Filters</span>
		</button>
	);
};

export default FilterButton;
