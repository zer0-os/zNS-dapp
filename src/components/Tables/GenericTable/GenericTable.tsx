/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './GenericTable.module.scss';
import { useInView } from 'react-intersection-observer';
import { IconButton, SearchBar, Spinner, TextButton } from 'components';
import grid from './assets/grid.svg';
import list from './assets/list.svg';

type GenericTableHeader = {
	label: string;
	accessor?: string;
	className?: string;
};

const GenericTable = (props: any) => {
	///////////////////////
	// State & Variables //
	///////////////////////

	// chunk defines which row we're up to when infinite scroll is enabled
	// i.e., chunk 2 with chunkSize 6 means we've loaded 12 rows
	const [chunk, setChunk] = useState<number>(1);

	const [isGridView, setIsGridView] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string>();

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
		return d.name.includes(searchQuery);
	};

	// Toggles to grid view when viewport
	// resizes to below 700px
	const handleResize = () => {
		if (window.innerWidth <= 700) {
			setIsGridView(true);
		}
	};

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		resetChunkSize();
	}, [isGridView, searchQuery]);

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

	///////////////
	// Fragments //
	///////////////

	// List view container and rows
	const ListView = useMemo(() => {
		const rows = () => {
			if (!rawData) {
				return <></>;
			}

			let filteredData = rawData.filter((d: any) =>
				searchQuery ? matchesSearch(d) : true,
			);

			if (!props.infiniteScroll) {
				return (
					<>
						{filteredData.map((d: any, index: number) => (
							<props.rowComponent
								key={index}
								rowNumber={index}
								data={d}
								headers={props.headers}
							/>
						))}
					</>
				);
			} else {
				return (
					<>
						{filteredData
							.slice(0, chunk * chunkSize)
							.map((d: any, index: number) => (
								<props.rowComponent
									key={d[props.itemKey]}
									rowNumber={index}
									data={d}
									headers={props.headers}
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
						{props.headers.map((h: GenericTableHeader, index: number) => (
							<th
								className={`${
									props.alignments && props.alignments[index] > 0
										? styles.Right
										: styles.Left
								} ${h?.className && styles[h?.className]}`}
								key={index}
							>
								{h?.label}
							</th>
						))}
					</tr>
				</thead>
				<tbody>{rows()}</tbody>
			</table>
		);
	}, [rawData, chunk, searchQuery]);

	// Grid View container & cards
	const GridView = useMemo(() => {
		if (!rawData) {
			return <></>;
		}
		const data = props.infiniteScroll
			? rawData
					.filter((d: any) =>
						searchQuery ? d.name.includes(searchQuery) : true,
					)
					.slice(0, chunk * chunkSize)
			: rawData.filter((d: any) =>
					searchQuery ? d.name.includes(searchQuery) : true,
			  );

		return (
			<div className={styles.Grid}>
				{data.map((d: any, index: number) => (
					<props.gridComponent
						key={d[props.itemKey]}
						rowNumber={index}
						data={d}
					/>
				))}
				{data.length === 2 && <div></div>}
				{data.length === 1 && (
					<>
						<div></div>
						<div></div>
					</>
				)}
			</div>
		);
	}, [rawData, chunk, searchQuery]);

	////////////
	// Render //
	////////////

	return (
		<div className={styles.Container} style={props.style}>
			<div ref={contentRef} className={styles.Content}>
				<div className={styles.Controls}>
					<SearchBar
						placeholder="Search by domain name"
						onChange={onSearchBarUpdate}
						style={{ width: '100%', marginRight: 16 }}
					/>
					<div className={styles.Buttons}>
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
