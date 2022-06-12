/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './GenericTable.module.scss';
import { LoadingIndicator, IconButton, SearchBar } from 'components';
import { usePropsState } from 'lib/hooks/usePropsState';
import { useInfiniteScroll } from 'lib/hooks/useInfiniteScroll';
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

	const isGridViewByDefault = props.isGridViewByDefault;

	const [searchQuery, setSearchQuery] = useState<string>();

	const shouldShowViewToggle = props.rowComponent && props.gridComponent;
	const shouldShowSearchBar = !props.notSearchable && props.data?.length > 0;
	const isSmallScreen = useMatchMedia(`(max-width: ${GRID_BREAKPOINT}px)`);

	const [isGridView, setIsGridView] = usePropsState<boolean>(
		!isSmallScreen && isGridViewByDefault,
	);

	const rawData = props.data || [];
	const chunkSize = isGridView ? 6 : 12;

	//////////////
	// Ddata    //
	/////////////
	// This will need to be expanded to be generic
	const matchesSearch = useCallback(
		(d: any): boolean => {
			if (!searchQuery) return true;

			if (!d || typeof d !== 'object') return false;

			const searchKey: string | string[] =
				props.searchKey ?? DEFAULT_SEARCH_KEY;

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
		},
		[props, searchQuery],
	);

	// Handle infinite scroll
	const filteredData = useMemo(() => {
		return rawData.filter((d: any) =>
			searchQuery && !props.notSearchable ? matchesSearch(d) : true,
		);
	}, [props.notSearchable, searchQuery, rawData]);

	const { ref, data, hasMore, reset } = useInfiniteScroll(
		filteredData,
		chunkSize,
	);

	//////////////
	// Handlers //
	/////////////
	// Change view type list <==> grid
	const changeView = useCallback(
		(isGridView: boolean) => {
			reset();
			setIsGridView(isGridView);
		},
		[reset, setIsGridView],
	);

	// Updates search query state based on search bar input
	const onSearchBarUpdate = useCallback(
		(event: any) => {
			const query = event.target.value;
			setSearchQuery(query.length > 2 ? query : undefined);
		},
		[setSearchQuery],
	);

	// Toggles to grid view when viewport
	// resizes to below 700px
	const handleResize = useCallback(() => {
		if (window.innerWidth <= 700) {
			changeView(true);
		}
	}, [changeView]);

	/////////////
	// Effects //
	/////////////

	// Add a listener for window resizes
	useEffect(() => {
		window.addEventListener('resize', handleResize);
		handleResize();
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	///////////////
	// Fragments //
	///////////////

	// List view container and rows
	const renderListView = useCallback(() => {
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
				<tbody>
					{data.map((d: any, index: number) => (
						<props.rowComponent
							key={d[props.itemKey] ?? index}
							rowNumber={index}
							data={d}
							headers={props.headers}
						/>
					))}
				</tbody>
			</table>
		);
	}, [props, data]);

	// Grid View container & cards
	const renderGridView = useCallback(() => {
		return (
			<div
				className={`${styles.Grid} ${
					props.isSingleGridColumn && styles.GridWithSingleColumn
				}`}
			>
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
	}, [props, data]);

	////////////
	// Render //
	////////////

	return (
		<div className={styles.Container} style={props.style}>
			<div className={styles.Content}>
				{shouldShowSearchBar && (
					<div className={styles.Controls}>
						<SearchBar
							placeholder={'Search by ' + (props.searchBy ?? 'domain name')}
							onChange={onSearchBarUpdate}
							style={{ width: '100%' }}
						/>
						{shouldShowViewToggle && !isSmallScreen && (
							<div className={styles.Buttons}>
								<IconButton
									onClick={() => changeView(false)}
									toggled={!isGridView}
									iconUri={list}
									style={{ height: 32, width: 32 }}
								/>
								<IconButton
									onClick={() => changeView(true)}
									toggled={isGridView}
									iconUri={grid}
									style={{ height: 32, width: 32 }}
								/>
							</div>
						)}
					</div>
				)}

				{props.isReloading && (
					<LoadingIndicator className={styles.Reloading} text="" />
				)}

				{!props.isLoading &&
					((rawData?.length ?? 0) === 0 ? (
						<p className={classNames(styles.Loading, 'text-center')}>
							{props.emptyText}
						</p>
					) : isGridView ? (
						renderGridView()
					) : (
						renderListView()
					))}

				{props.isLoading && (
					<LoadingIndicator
						className={styles.Loading}
						text={props.loadingText ? props.loadingText : 'Loading'}
						spinnerPosition="left"
					/>
				)}

				<div ref={hasMore ? ref : undefined} />
			</div>
		</div>
	);
};

export default GenericTable;
