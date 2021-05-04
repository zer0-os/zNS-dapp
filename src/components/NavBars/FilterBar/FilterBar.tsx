import React, { useState } from 'react'

import styles from './FilterBar.module.css'

import { TextButton } from 'components'

type FilterBarProps = {
    filters: string[];
    onSelect: (filter: string) => void;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onSelect, style, children }) => {

    const [ selected, setSelected ] = useState(filters.length ? filters[0] : '')

    const select = (filter: string) => {
        setSelected(filter)
        onSelect(filter)
    }

    return(
        <div className={`${styles.FilterBar} blur`} style={style}>
            { children }
            <ul>
                { filters.map((filter, index) => 
                    <li key={index}>
                    <TextButton 
                        onClick={() => select(filter)}
                        selected={selected === filter}
                    >{filter}</TextButton></li>
                )}
            </ul>
        </div>
    )
}

export default FilterBar