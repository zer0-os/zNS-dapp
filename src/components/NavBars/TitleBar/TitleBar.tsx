//- React Imports
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

//- Component Imports
import { IconButton, ZNALink, Overlay } from 'components';

//- Library Imports
import { useDomainSearch } from 'lib/useDomainSearch';
import { getRelativeDomainPath } from 'lib/domains';

//- Asset Imports
import arrowForwardIcon from 'assets/arrow-forward.svg';
import arrowBackIcon from 'assets/arrow-back.svg';

//- Style Imports
import styles from './TitleBar.module.css';

type SearchResult = {
	name: string;
	domain: string;
};

type TitleBarProps = {
	style?: React.CSSProperties;
	children: React.ReactNode;
	// searchResults?: SearchResult[];
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
	// searchResults,
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

	const config = {
		smallestSearchQuery: 2,
		isExactMatchEnabled: false,
	};

	const [searchQuery, setSearchQuery] = useState('');

	const onSearchChange = (event: any) => setSearchQuery(event.target.value);

	const openSearch = () => {
		setSearchQuery('');
		setIsSearchActive(true);
	};
	const closeSearch = () => {
		setTimeout(() => {
			setIsSearchActive(false);
			setSearchQuery('');
		}, 100);
	};

	const go = (to: string) => {
		console.log('to');
		const relativeDomain = getRelativeDomainPath(to);
		history.push(relativeDomain);
	};

	useEffect(() => {
		// If the query is valid, set the pattern
		// Else set the pattern to an invalid domain so it empties the search
		if (searchQuery.length >= config.smallestSearchQuery)
			domainSearch.setPattern(searchQuery);
		else domainSearch.setPattern('?');
	}, [searchQuery]);

	return (
		<nav
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
						value={searchQuery}
						type="text"
						onFocus={openSearch}
						onBlur={closeSearch}
					/>
				</div>
				{children}
			</div>
			{isSearchActive && searchQuery.length >= config.smallestSearchQuery && (
				<ul className={styles.SearchResults}>
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
						.slice(0, 9)
						.map((s) => (
							<li onClick={() => go(s.name)} key={s.name}>
								{s.name.split('.')[s.name.split('.').length - 1]}
								<span>{s.name}</span>
							</li>
						))}
				</ul>
			)}
		</nav>
	);
};

export default TitleBar;
