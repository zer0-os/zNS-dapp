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

const GenericTable = (props: any) => {
	///////////////////////
	// State & Variables //
	///////////////////////

	// chunk defines which row we're up to when infinite scroll is enabled
	// i.e., chunk 2 with chunkSize 6 means we've loaded 12 rows
	const [chunk, setChunk] = useState<number>(1);

	const [isGridView, setIsGridView] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string>();

	//This handles the filter selection
	const [statusFilter, setStatusFilter] = useState('');
	const [domainFilter, setDomainFilter] = useState('All Domains');

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

	// Since due date is coming up, I'm rushing the search algo
	// This will need to be expanded to be generic
	const matchesSearch = (d: any) => {
		switch (true) {
			case props.isFilterRequired:
				let s = d.request.domain.toLowerCase();
				return s.indexOf(searchQuery?.toLowerCase()) > -1;
			default:
				d.name.includes(searchQuery);
		}

		// if (props.isFilterRequired) {
		// 	let s = d.request.domain.toLowerCase();
		// 	return s.indexOf(searchQuery?.toLowerCase()) > -1;
		// } else return d.name.includes(searchQuery);
	};

	const matchesFilter = (d: any) => {
		switch (true) {
			case props.isRequestTable:
				const approved = statusFilter === 'Accepted';
				return d.request.approved === approved;
			default:
				d.name.includes(searchQuery);
		}
	};

	// Toggles to grid view when viewport
	// resizes to below 700px
	const handleResize = () => {
		if (window.innerWidth <= 700) {
			setIsGridView(true);
		}
	};

	const filterByStatus = (filter: string) => setStatusFilter(filter);
	const filterByDomain = (filter: string) => setDomainFilter(filter);

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		resetChunkSize();
	}, [isGridView, searchQuery, statusFilter, domainFilter]);

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
	}, [rawData, searchQuery]);

	// if (props.isRequestTable) const settingDomainFilter = () => {
	// 	if(props.isRequestTable)
	// };

	/////////////////
	// Data Handler//
	/////////////////

	const displayData = useMemo(() => {
		if (
			searchQuery?.length ||
			(statusFilter.length && statusFilter !== 'All Statuses')
		) {
			var filtered = rawData;

			// Filter per search string
			if (searchQuery?.length) {
				filtered = filtered.filter((r: any) => matchesSearch(r));
			}

			// Filter
			if (statusFilter.length) {
				filtered = filtered.filter((r: any) => matchesFilter(r));
			}

			return filtered;
		}
		return rawData;
	}, [searchQuery, statusFilter, rawData]);
	console.log(displayData, 'display data');
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
						{displayData.map((d: any, index: number) => (
							<props.rowComponent
								key={index}
								rowNumber={index}
								data={d}
								view={props.view}
							/>
						))}
					</>
				);
			} else {
				return (
					<>
						{displayData
							.slice(0, chunk * chunkSize)
							.map((d: any, index: number) => (
								<props.rowComponent
									key={index}
									rowNumber={index}
									data={d}
									view={props.view}
								/>
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
	}, [rawData, chunk, searchQuery, statusFilter]);

	// Grid View container & cards
	const GridView = useMemo(() => {
		if (!rawData) {
			return <></>;
		}
		const data = props.infiniteScroll
			? displayData
					.filter((d: any) => (searchQuery ? matchesSearch(searchQuery) : true))
					.slice(0, chunk * chunkSize)
			: displayData.filter((d: any) => (searchQuery ? matchesSearch(d) : true));

		return (
			<div className={styles.Grid}>
				{data.map((d: any, index: number) => (
					<props.gridComponent
						key={index}
						rowNumber={index}
						data={d}
						view={props.view}
						isLoading={props.isLoading}
					/>
				))}
			</div>
		);
	}, [rawData, chunk, searchQuery]);

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
						{props.isFilterRequired ? (
							<>
								<OptionDropdown
									onSelect={filterByDomain}
									options={props.optionsFilterByDomain.map(
										(opt: string) => opt,
									)}
									drawerStyle={{
										width: 179,
										color: props.dropDownColorText
											? props.dropDownColorText
											: '',
									}}
								>
									<FilterButton onClick={() => {}}>
										{domainFilter || props.optionsFilterByDomain[0]}
									</FilterButton>
								</OptionDropdown>

								<OptionDropdown
									onSelect={filterByStatus}
									options={props.optionsFilterByStatus.map(
										(opt: string) => opt,
									)}
									drawerStyle={{
										width: 179,
										color: props.dropDownColorText
											? props.dropDownColorText
											: '',
									}}
								>
									<FilterButton onClick={() => {}}>
										{statusFilter || props.optionsFilterByStatus[0]}
									</FilterButton>
								</OptionDropdown>
								<div />
							</>
						) : (
							<></>
						)}
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
};

export default GenericTable;
