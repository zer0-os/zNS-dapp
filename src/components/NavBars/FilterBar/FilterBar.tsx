//- React Imports
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

//- Style Imports
import styles from './FilterBar.module.scss';

//- Component Imports
import { TextButton } from 'components';

//- Asset Imports
import wilderIcon from './assets/WWLogo_SVG.svg';

type FilterBarProps = {
	//This has been commented out until filter features are implemented
	// filters: string[];
	// onSelect: (filter: string) => void;
	style?: React.CSSProperties;
	children?: React.ReactNode;
};

var lastY = 0; // Just a global variable to stash last scroll position

const FilterBar: React.FC<FilterBarProps> = ({
	//This has been commented out until filter features are implemented
	// filters,
	// onSelect,
	style,
	children,
}) => {
	//- State

	//This has been commented out until filter features are implemented
	// const [selected, setSelected] = useState(filters.length ? filters[0] : '');

	//- Data
	const body = document.getElementsByTagName('body')[0];

	//- Hooks
	const history = useHistory();

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

	//This has been commented out until filter features are implemented

	// const select = (filter: string) => {
	// 	setSelected(filter);
	// 	onSelect(filter);
	// };

	const home = () => {
		history.push('/');
	};

	return (
		<nav
			className={`${styles.FilterBar} blur ${hideHeader ? styles.Hidden : ''}`}
			style={style}
		>
			{/* TODO: Move Wilder icon out of this component */}
			<div className={styles.Wilder}>
				<img alt="home icon" src={wilderIcon} onClick={home} />
			</div>
			{children}
			{/* <ul>
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
			</ul> */}
		</nav>
	);
};

export default FilterBar;
