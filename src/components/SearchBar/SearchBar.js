import React from 'react';

import searchBarStyles from './SearchBar.module.scss';

// TODO: Convert to TypeScript
const SearchBar = (props) => {
	return (
		<div
			className={searchBarStyles.searchBar + '  background-primary'}
			style={props.style}
		>
			<input
				onChange={props.onChange}
				type="text"
				placeholder={props.placeholder ? props.placeholder : 'Search'}
			/>
			<button></button>
		</div>
	);
};

export default SearchBar;
