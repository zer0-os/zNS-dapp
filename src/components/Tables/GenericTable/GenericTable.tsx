/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './GenericTable.module.scss';
import { useInView } from 'react-intersection-observer';
import {
	LoadingIndicator,
	IconButton,
	SearchBar,
	TextButton,
} from 'components';
import { usePropsState } from 'lib/hooks/usePropsState';
import grid from './assets/grid.svg';
import list from './assets/list.svg';
import classNames from 'classnames';
import useMatchMedia from 'lib/hooks/useMatchMedia';

const DEFAULT_SEARCH_KEY = 'name';
const GRID_BREAKPOINT = 744;

type GenericTableHeader = {
	label: string | React.ReactNode;
	accessor?: string;
	className?: string;
};

const GenericTable = (props: any) => {
	///////////////////////
	// State & Variables //
	///////////////////////
	const isGridViewByDefault =
		window.innerWidth <= GRID_BREAKPOINT || props.isGridViewByDefault;

	// chunk defines which row we're up to when infinite scroll is enabled
	// i.e., chunk 2 with chunkSize 6 means we've loaded 12 rows
	const [chunk, setChunk] = useState<number>(1);

	const [isGridView, setIsGridView] =
		usePropsState<boolean>(isGridViewByDefault);
	const [searchQuery, setSearchQuery] = useState<string>();

	const contentRef = useRef<HTMLDivElement>(null);

	const rawData = props.data;
	const chunkSize = isGridView ? 6 : 12;

	const shouldShowViewToggle = props.rowComponent && props.gridComponent;
	const shouldShowSearchBar = !props.notSearchable && props.data?.length > 0;

	const isSmallScreen = useMatchMedia(`(max-width: ${GRID_BREAKPOINT}px)`);

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
	const matchesSearch = (d: any): boolean => {
		if (!searchQuery) return true;

		if (!d || typeof d !== 'object') return false;

		const searchKey: string | string[] = props.searchKey ?? DEFAULT_SEARCH_KEY;

		if (Array.isArray(searchKey)) {
			return searchKey.some(
				(key: string) =>
					Boolean(d[key]) &&
					d[key].toLowerCase().includes(searchQuery.toLocaleLowerCase()),
			);
		}

		return (
			Boolean(d[searchKey]) &&
			d[searchKey].toLowerCase().includes(searchQuery.toLocaleLowerCase())
		);
	};

	// Toggles to grid view when viewport
	// resizes to below set px
	const handleResize = () => {
		if (
			window.innerWidth <= GRID_BREAKPOINT &&
			props.gridComponent !== undefined
		) {
			setIsGridView(true);
		} else if (props.notSearchable) {
			setIsGridView(false);
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
		if (!rawData || !props.gridComponent) {
			return <></>;
		}
		const data = props.infiniteScroll
			? rawData
					.filter((d: any) =>
						searchQuery && !props.notSearchable ? matchesSearch(d) : true,
					)
					.slice(0, chunk * chunkSize)
			: rawData.filter((d: any) =>
					searchQuery && !props.notSearchable ? matchesSearch(d) : true,
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
	}, [props, rawData, chunk, chunkSize, searchQuery]);

	////////////
	// Render //
	////////////

	return (
		<div className={styles.Container} style={props.style}>
			<div ref={contentRef} className={styles.Content}>
				{shouldShowSearchBar && (
					<div className={styles.Controls}>
						{shouldShowSearchBar && (
							<SearchBar
								placeholder={'Search by ' + (props.searchBy ?? 'domain name')}
								onChange={onSearchBarUpdate}
								style={{ width: '100%' }}
							/>
						)}
						{shouldShowViewToggle && !isSmallScreen && (
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
						)}
					</div>
				)}
				{!props.isLoading &&
					((rawData?.length ?? 0) === 0 ? (
						<p className={classNames(styles.Loading, 'text-center')}>
							{props.emptyText}
						</p>
					) : props.gridComponent !== undefined &&
					  (isGridView || isSmallScreen) ? (
						GridView
					) : (
						ListView
					))}

				{props.isLoading && (
					<LoadingIndicator
						className={styles.Loading}
						text={props.loadingText ? props.loadingText : 'Loading'}
						spinnerPosition="left"
					/>
				)}
				<div ref={ref}></div>
			</div>

			{props.infiniteScroll &&
				rawData &&
				!searchQuery &&
				chunk * chunkSize < rawData.length && (
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
