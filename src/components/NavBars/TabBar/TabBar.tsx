/* eslint-disable react-hooks/exhaustive-deps */
//- React Imports
import React, { useState, useRef, useEffect } from 'react';

//- Style Imports
import styles from './TabBar.module.css';

type TabBarProps = {
	tabs: string[];
	onSelect: (option: string) => void;
	tabStyle?: React.CSSProperties;
	sliderStyle?: React.CSSProperties;
	selection?: string;
};

const TabBar: React.FC<TabBarProps> = ({
	tabs,
	onSelect,
	tabStyle,
	sliderStyle,
	selection,
}) => {
	//////////////////
	// State & Refs //
	//////////////////

	const [selected, setSelected] = useState(selection || tabs[0] || '');
	const [sliderX, setSliderX] = useState(0);
	const [sliderWidth, setSliderWidth] = useState(0);
	const sliderRef = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLUListElement>(null);
	const selectedRef = useRef<HTMLLIElement>(null);
	const selectedIndex = tabs.indexOf(selected);

	///////////////
	// Functions //
	///////////////

	const select = (option: string) => {
		if (tabs.indexOf(option) < 0) return;
		setSelected(option);
		if (onSelect) onSelect(option);
	};

	useEffect(() => {
		if (listRef && listRef.current) {
			const list = listRef.current.children;
			var total = 0;
			for (var i = 0; i < list.length; i++) {
				if (i >= selectedIndex) break;
				total += list[i].clientWidth + 40;
			}
			setSliderX(total);
		}
		if (selectedRef && selectedRef.current) {
			setSliderWidth(selectedRef.current.clientWidth);
		}
	}, [selected]);

	return (
		<div className={styles.Bar}>
			<ul ref={listRef}>
				{tabs.map((t) => (
					<li
						className={`${styles.Tab} ${selected === t ? styles.Selected : ''}`}
						style={tabStyle}
						key={t}
						onClick={() => select(t)}
						ref={selected === t ? selectedRef : null}
					>
						<button title={t}>{t}</button>
					</li>
				))}
			</ul>
			<div
				ref={sliderRef}
				style={{
					...sliderStyle,
					left: sliderX,
					width: sliderWidth,
				}}
				className={styles.Slider}
			></div>
			<hr className="glow" />
		</div>
	);
};

export default TabBar;
