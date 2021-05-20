import React from 'react'

import searchBarStyles from './SearchBar.module.css'

// TODO: Convert to TypeScript
const SearchBar = (props) => {

    return (
        <div 
            className={searchBarStyles.searchBar + ' blur'} 
            style={props.style}
        >
            <input onChange={props.onChange} type='text' placeholder='Search' />
            <button></button>
        </div>
    )
}

export default SearchBar 