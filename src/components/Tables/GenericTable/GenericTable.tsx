import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './GenericTable.module.css';
import { useInView } from 'react-intersection-observer';
import { IconButton, SearchBar, Spinner } from 'components';
import grid from './assets/grid.svg';
import list from './assets/list.svg';

const GenericTable = (props: any) => {
	const chunkSize = 6;
	const [chunk, setChunk] = useState<number>(1);

	const [isGridView, setIsGridView] = useState<boolean>(true);

	const rawData = props.data;

	const { ref, entry } = useInView();

	const search = (query: string) => {
		console.log(query);
	};

	const resetChunkSize = () => {
		setChunk(1);
	};

	const increaseChunkSize = () => {
		console.log('increasing chunk size');
		setChunk(chunk + 1);
	};

	useEffect(() => {
		if (entry?.isIntersecting) {
			increaseChunkSize();
		}
	}, [entry]);

	useEffect(() => {
		resetChunkSize();
	}, [rawData, isGridView]);

	const ListView = useMemo(() => {
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
				<tbody>
					{!props.infiniteScroll &&
						rawData &&
						rawData.map((d: any, index: number) => (
							<props.rowComponent key={index} rowNumber={index} data={d} />
						))}
					{props.infiniteScroll &&
						rawData &&
						rawData
							.slice(0, chunk * chunkSize)
							.map((d: any, index: number) => (
								<props.rowComponent key={index} rowNumber={index} data={d} />
							))}
				</tbody>
			</table>
		);
	}, [rawData, chunk]);

	const GridView = useMemo(() => {
		return (
			<div className={styles.Grid}>
				{!props.infiniteScroll &&
					rawData &&
					rawData.map((d: any, index: number) => (
						<props.gridComponent key={index} rowNumber={index} data={d} />
					))}
				{props.infiniteScroll &&
					rawData &&
					rawData
						.slice(0, chunk * chunkSize)
						.map((d: any, index: number) => (
							<props.gridComponent key={index} rowNumber={index} data={d} />
						))}
			</div>
		);
	}, [rawData, chunk]);

	return (
		<div
			className={`${styles.Container} background-primary border-rounded border-primary`}
			style={props.style}
		>
			<div className={styles.Controls}>
				<SearchBar
					placeholder="Search by domain name"
					onChange={(event: any) => search(event.target.value)}
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
			{!props.isLoading && isGridView ? GridView : ListView}
			<div ref={ref}></div>
			{props.isLoading && (
				<div className={styles.Loading}>
					<Spinner /> {props.loadingText ? props.loadingText : 'Loading'}
				</div>
			)}
		</div>
	);
};

export default GenericTable;
