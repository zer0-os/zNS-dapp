import React, { useState, useEffect } from 'react'
import useScrollPosition from '@react-hook/window-scroll';

import styles from './FilterBar.module.css'

import { TextButton } from 'components'

type FilterBarProps = {
    filters: string[];
    onSelect: (filter: string) => void;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

var lastY = 0 // Just a global variable to stash last scroll position

const FilterBar: React.FC<FilterBarProps> = ({ filters, onSelect, style, children }) => {

    const [ selected, setSelected ] = useState(filters.length ? filters[0] : '')

    // TODO: Move hidden header to a separate component
    const [hideHeader, setHideHeader] = useState(false)
    const handleScroll = () => {
        const hide = window.pageYOffset > 100 && window.pageYOffset > lastY
        lastY = window.pageYOffset
        setHideHeader(hide)
    }
    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [ hideHeader ])

    const select = (filter: string) => {
        setSelected(filter)
        onSelect(filter)
    }

    return(
        <div className={`${styles.FilterBar} blur ${hideHeader ? styles.Hidden : ''}`} style={style}>
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