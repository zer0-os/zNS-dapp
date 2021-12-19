//- React Imports
import React, { useState, useEffect } from 'react';

//- Style Imports
import styles from './FilterBar.module.scss';

//- Component Imports
import { TextButton } from 'components';

type FilterBarProps = {
	filters: string[];
	onSelect: (filter: string) => void;
	style?: React.CSSProperties;
	children?: React.ReactNode;
};

var lastY = 0; // Just a global variable to stash last scroll position

const FilterBar: React.FC<FilterBarProps> = ({
	filters,
	onSelect,
	style,
	children,
}) => {
	//- State
	const [selected, setSelected] = useState(filters.length ? filters[0] : '');

	//- Data
	const body = document.getElementsByTagName('body')[0];

	// TODO: Move hidden header to a separate component
	const [hideHeader, setHideHeader] = useState(false);
	const handleScroll = () => {
		if (body.scrollTop > 60 && body.scrollTop > lastY) {
			// Going down and at least 60 pixels
			lastY = body.scrollTop;
			setHideHeader(true);
		} else if (lastY - body.scrollTop >= 10) {
			// Going up and more than 10 pixel
			lastY = body.scrollTop;
			setHideHeader(false);
		}
	};

	useEffect(() => {
		body.addEventListener('scroll', handleScroll);
		return () => body.removeEventListener('scroll', handleScroll);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const select = (filter: string) => {
		setSelected(filter);
		onSelect(filter);
	};

	return (
		<nav
			className={`${styles.FilterBar} blur ${hideHeader ? styles.Hidden : ''}`}
			style={style}
		>
			{children}
			<ul>
				{filters.map((filter, index) => (
					<li key={index}>
						<TextButton
							onClick={() => select(filter)}
							selected={selected === filter}
						>
							{filter}
						</TextButton>
					</li>
				))}
			</ul>
		</nav>
	);
};

export default FilterBar;
