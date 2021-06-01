//- React Imports
import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';

//- Component Imports
import { IconButton, ZNALink } from 'components';

//- Library Imports
import { useDomainSearch } from 'lib/useDomainSearch';
import { getRelativeDomainPath } from 'lib/domains';

//- Asset Imports
import arrowForwardIcon from 'assets/arrow-forward.svg';
import arrowBackIcon from 'assets/arrow-back.svg';

//- Style Imports
import styles from './TitleBar.module.css';

type TitleBarProps = {
	style?: React.CSSProperties;
	children: React.ReactNode;
	canGoBack: boolean;
	onBack: () => void;
	canGoForward: boolean;
	onForward: () => void;
	domain: string;
	setIsSearchActive: (active: boolean) => void;
	isSearchActive: boolean;
};

const TitleBar: React.FC<TitleBarProps> = ({
	style,
	children,
	canGoBack,
	onBack,
	canGoForward,
	onForward,
	domain,
	setIsSearchActive,
	isSearchActive,
}) => {
	const domainSearch = useDomainSearch();
	const history = useHistory();
	const searchInput = useRef<HTMLInputElement>(null);

	const config = {
		smallestSearchQuery: 2,
		isExactMatchEnabled: false,
	};

	const [searchQuery, setSearchQuery] = useState('');

	// Input Key Presses
	const onSearchChange = (event: any) => setSearchQuery(event.target.value);
	const checkEscape = (event: any) => {
		if (event.which === 27) searchInput?.current?.blur();
	};

	const openSearch = () => {
		setIsSearchActive(true);
	};
	const closeSearch = () => {
		// Search is disappearing before the click registers
		// Set a little timeout so the row click registers before de-rendering
		setTimeout(() => {
			setIsSearchActive(false);
			setSearchQuery('');
		}, 120);
	};

	const go = (to: string) => {
		const relativeDomain = getRelativeDomainPath(to);
		history.push(relativeDomain);
	};

	useEffect(() => {
		// If the query is valid, set the pattern
		// Else set the pattern to an invalid domain so it empties the search
		if (searchQuery.length >= config.smallestSearchQuery)
			domainSearch.setPattern(searchQuery);
		else domainSearch.setPattern('?');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchQuery]);

	return (
		<div
			className={`${styles.TitleBar} ${
				isSearchActive ? styles.Searching : ''
			} border-primary`}
		>
			<div className={styles.Bar}>
				<div className={styles.Navigation}>
					<IconButton
						iconUri={arrowBackIcon}
						onClick={onBack}
						style={{ height: 32, width: 32 }}
						disabled={!canGoBack}
						alt={'back'}
					/>
					<IconButton
						iconUri={arrowForwardIcon}
						onClick={onForward}
						style={{ height: 32, width: 32, marginLeft: 4 }}
						disabled={!canGoForward}
						alt={'forward'}
					/>
					{/* TODO: Split this into its own component */}
					{!isSearchActive && (
						<ZNALink style={{ marginLeft: 16 }} domain={domain} />
					)}
					<input
						className={styles.Search}
						onChange={onSearchChange}
						onKeyUp={checkEscape}
						value={searchQuery}
						type="text"
						onFocus={openSearch}
						onBlur={closeSearch}
						ref={searchInput}
					/>
				</div>
				{children}
			</div>
			{isSearchActive && (
				<ul className={`${styles.SearchResults} blur border-primary`}>
					{/* @TODO: Implement exact domain properly */}
					{config.isExactMatchEnabled && domainSearch?.exactMatch?.name && (
						<li
							className={styles.ExactMatch}
							key={domainSearch.exactMatch.name}
							onClick={() => go(domainSearch?.exactMatch?.name || '')}
						>
							{
								domainSearch.exactMatch.name.split('.')[
									domainSearch.exactMatch.name.split('.').length - 1
								]
							}{' '}
							<span>{domainSearch.exactMatch.name}</span>
						</li>
					)}
					{domainSearch?.matches
						?.filter((d) => d.name.length > 1)
						.map((s, i) => (
							<li onClick={() => go(s.name)} key={i + s.name}>
								{s.name.split('.')[s.name.split('.').length - 1]}
								<span>{s.name}</span>
							</li>
						))}
					{domainSearch.matches?.length === 0 && (
						<li key={'type'}>Type to search domains!</li>
					)}
				</ul>
			)}
		</div>
	);
};

export default TitleBar;
