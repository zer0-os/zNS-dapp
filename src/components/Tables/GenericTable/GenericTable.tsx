/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './GenericTable.module.css';
import { useInView } from 'react-intersection-observer';
import {
	IconButton,
	SearchBar,
	Spinner,
	TextButton,
	FilterButton,
	OptionDropdown,
} from 'components';
import grid from './assets/grid.svg';
import list from './assets/list.svg';
import React from 'react';

const GenericTable = React.memo((props: any) => {
	///////////////////////
	// State & Variables //
	///////////////////////

	// chunk defines which row we're up to when infinite scroll is enabled
	// i.e., chunk 2 with chunkSize 6 means we've loaded 12 rows
	const [chunk, setChunk] = useState<number>(1);
	const [isGridView, setIsGridView] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string>();

	//This handles the filter selection
	const [filter, setFilter] = useState<any>('');
	const contentRef = useRef<HTMLDivElement>(null);

	const rawData = props.data;
	const chunkSize = isGridView ? 6 : 12;

	// Handler for infinite scroll trigger
	const {
		ref,
		inView: shouldLoadMore,
		entry,
	} = useInView({ initialInView: true });

	///////////////
	// Functions //
	///////////////

	const resetChunkSize = () => {
		setChunk(1);
	};

	const increaseChunkSize = (amount?: number) => {
		if (rawData && chunk * chunkSize <= rawData.length) {
			setChunk(chunk + (amount || 1));
		}
	};

	// Updates search query state based on search bar input
	const onSearchBarUpdate = (event: any) => {
		const query = event.target.value;
		setSearchQuery(query.length > 2 ? query : undefined);
	};

	const searchEffect = (query: string | undefined) => {
		// depends on query and filters
		let searchResults;
		let filterResults = props.data;

		if (query) {
			searchResults = props.search(query, props.data);
			return searchResults;
		}
		if (filter) {
			filterResults = props.filter(filter, filterResults);
			return filterResults;
		} else {
			return searchResults || filterResults;
		}
	};

	const searchResults = useMemo(
		() => searchEffect(searchQuery),
		[filter, searchQuery],
	);

	// Toggles to grid view when viewport
	// resizes to below 700px
	const handleResize = () => {
		if (window.innerWidth <= 700) {
			setIsGridView(true);
		}
	};

	const getFilterSelection = (filter: string) => setFilter(filter);

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		resetChunkSize();
	}, [isGridView, searchQuery, filter]);

	// Add a listener for window resizes
	useEffect(() => {
		window.addEventListener('resize', handleResize);
		handleResize();
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	useEffect(() => {
		resetChunkSize();
	}, [rawData]);

	useEffect(() => {
		if (entry?.isIntersecting) {
			increaseChunkSize();
		}
	}, [entry]);

	useEffect(() => {
		if (shouldLoadMore && chunk === 1) {
			increaseChunkSize();
		}
	}, [rawData, searchQuery, filter]);

	///////////////
	// Fragments //
	///////////////

	// List view container and rows
	const ListView = useMemo(() => {
		const rows = () => {
			if (!rawData) {
				return <></>;
			}

			if (!props.infiniteScroll) {
				return (
					<>
						{(searchResults || props.data).map((d: any, index: number) => (
							<props.rowComponent key={index} rowNumber={index} data={d} />
						))}
					</>
				);
			} else {
				return (
					<>
						{(searchResults || props.data)
							.slice(0, chunk * chunkSize)
							.map((d: any, index: number) => (
								<props.rowComponent key={index} rowNumber={index} data={d} />
							))}
					</>
				);
			}
		};

		return (
			<table className={styles.Table}>
				<thead>
					<tr>
						{props.headers.map((h: string, index: number) => (
							<th
								className={
									props.alignments && props.alignments[index] === 0
										? styles.Right
										: props.alignments[index] === 1
										? styles.Left
										: props.alignments[index] === 2
										? styles.Center
										: ''
								}
								style={{
									paddingRight:
										props.alignments[index] === 2 && props.adjustHeaderStatus
											? props.adjustHeaderStatus
											: '',
								}}
							>
								{h}
							</th>
						))}
					</tr>
				</thead>
				<tbody>{rows()}</tbody>
			</table>
		);
	}, [rawData, chunk, searchQuery, filter]);

	// Grid View container & cards
	const GridView = useMemo(() => {
		if (!rawData) {
			return <></>;
		}
		const data = props.infiniteScroll
			? (searchResults || props.data).slice(0, chunk * chunkSize)
			: searchResults || props.data;

		return (
			<div className={styles.Grid}>
				{data.map((d: any, index: number) => (
					<props.gridComponent key={index} rowNumber={index} data={d} />
				))}
			</div>
		);
	}, [rawData, chunk, searchQuery, filter]);

	const Filters = () => {
		return (
			<>
				{/* 
		@NOTE:

		Filters data should come on this format: 
		—The object can be extended if more functionalities are required or filters need to be extended:

		const filterOpts ={ 
		default: 0,
		selected: domainFilter,
		options: ['All Domains', 'Your Domains', 'Your Requests'],
		setSelected: (filter: string) => filter
		}
		The props.filterData expects an array of objs with this parameters.
		How the object is handled would be the container's concern.
		
		 */}

				{props.filtersData.map((filter: any, idx: number) => {
					return (
						<OptionDropdown
							onSelect={getFilterSelection}
							options={filter.options.map((opt: string) => opt)}
							drawerStyle={{
								width: 179,
								color: props.dropDownColorText ? props.dropDownColorText : '',
							}}
						>
							<FilterButton onClick={() => {}}>
								{filter.selected || filter.options[filter.default]}
							</FilterButton>
						</OptionDropdown>
					);
				})}

				<div />
			</>
		);
	};

	////////////
	// Render //
	////////////

	return (
		<div
			className={`${styles.Container} background-primary border-rounded border-primary`}
			style={props.style}
		>
			<div ref={contentRef} className={styles.Content}>
				<div className={styles.Controls}>
					<SearchBar
						placeholder="Search by domain name"
						onChange={onSearchBarUpdate}
						style={{ width: '100%', marginRight: 16 }}
					/>

					<div className={styles.Buttons}>
						{props.isFilterRequired ? <>{Filters()}</> : <></>}
						<IconButton
							onClick={() => setIsGridView(false)}
							toggled={!isGridView}
							iconUri={list}
							style={{ height: 32, width: 32 }}
						/>
						<IconButton
							onClick={() => setIsGridView(true)}
							toggled={isGridView}
							iconUri={grid}
							style={{ height: 32, width: 32 }}
						/>
					</div>
				</div>

				{!props.isLoading && (isGridView ? GridView : ListView)}
				{props.isLoading && (
					<div className={styles.Loading}>
						<Spinner /> {props.loadingText ? props.loadingText : 'Loading'}
					</div>
				)}
				<div ref={ref}></div>
			</div>
			{rawData && !searchQuery && chunk * chunkSize < rawData.length && (
				<TextButton
					onClick={() =>
						isGridView ? increaseChunkSize() : increaseChunkSize(2)
					}
					className={styles.LoadMore}
				>
					Load More
				</TextButton>
			)}
		</div>
	);
});

export default GenericTable;
