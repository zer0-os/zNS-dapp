import React, { ChangeEventHandler } from 'react';

import searchBarStyles from './SearchBar.module.scss';

type SearchBarProps = {
	placeholder: string;
	onChange: ChangeEventHandler<HTMLInputElement>;
	style?: React.CSSProperties;
};
// TODO: Convert to TypeScript
const SearchBar = (props: SearchBarProps) => {
	return (
		<div className={searchBarStyles.searchBar + ' blur'} style={props.style}>
			<input
				onChange={props.onChange}
				type="text"
				placeholder={props.placeholder ? props.placeholder : 'Search'}
			/>
			<button className={searchBarStyles.ButtonIconStyles}></button>
		</div>
	);
};

export default SearchBar;
