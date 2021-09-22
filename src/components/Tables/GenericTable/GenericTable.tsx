import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './GenericTable.module.css';
import { useInView } from 'react-intersection-observer';
import { IconButton, SearchBar, Spinner } from 'components';
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

	const rawData = props.data;
	const chunkSize = 6;

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

	const increaseChunkSize = () => {
		setChunk(chunk + 1);
	};

	// Updates search query state based on search bar input
	const onSearchBarUpdate = (event: any) => {
		const query = event.target.value;
		setSearchQuery(query.length > 2 ? query : undefined);
	};

	const matchesSearch = (d: any) => {
		// Since due date is coming up, I'm rushing the search algo
		// This will need to be expanded to be generic
		return d.name.includes(searchQuery);
	};

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		if (entry?.isIntersecting) {
			increaseChunkSize();
		}
	}, [entry]);

	useEffect(() => {
		resetChunkSize();
	}, [rawData, isGridView, searchQuery]);

	useEffect(() => {
		// if (shouldLoadMore) {
		// 	increaseChunkSize();
		// }
	}, [rawData, searchQuery]);

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
							<props.rowComponent key={index} rowNumber={index} data={d} />
						))}
					</>
				);
			} else {
				return (
					<>
						{filteredData
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
									props.alignments && props.alignments[index] > 0
										? styles.Right
										: styles.Left
								}
							>
								{h}
							</th>
						))}
					</tr>
				</thead>
				<tbody>{rows()}</tbody>
				<div ref={ref}></div>
			</table>
		);
	}, [rawData, chunk, searchQuery]);

	const GridView = useMemo(() => {
		if (!rawData) {
			return <></>;
		}
		const data = props.infiniteScroll
			? rawData.filter((d: any) =>
					searchQuery ? d.name.includes(searchQuery) : true,
			  )
			: rawData
					.filter((d: any) =>
						searchQuery ? d.name.includes(searchQuery) : true,
					)
					.slice(0, chunk * chunkSize);

		return (
			<div className={styles.Grid}>
				{data.map((d: any, index: number) => (
					<props.gridComponent key={index} rowNumber={index} data={d} />
				))}
				<div ref={ref}></div>
			</div>
		);
	}, [rawData, chunk, searchQuery]);

	return (
		<div
			className={`${styles.Container} background-primary border-rounded border-primary`}
			style={props.style}
		>
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
		</div>
	);
};

export default GenericTable;
