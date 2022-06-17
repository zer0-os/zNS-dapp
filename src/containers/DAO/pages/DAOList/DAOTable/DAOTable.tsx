import { useState, useMemo, useCallback } from 'react';
import { zDAO } from '@zero-tech/zdao-sdk';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { useZdaoSdk } from 'lib/dao/providers/ZdaoSdkProvider';
import { GenericTable } from 'components';
import DAOTableCard from './DAOTableCard';
import DAOTableRow from './DAOTableRow';
import { TABLE_KEYS } from './DAOTable.constants';
import { DAOTableDataItem } from './DAOTable.types';

type DAOTableProps = {
	daoZnas?: string[];
};

const HEADERS = [
	{
		label: 'DAO',
		accessor: '',
		className: '',
	},
	{
		label: 'Value (USD)',
		accessor: '',
		className: '',
	},
];

const DAOTable = ({ daoZnas }: DAOTableProps) => {
	const { instance: sdk } = useZdaoSdk();

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [daos, setDaos] = useState<Array<zDAO>>([]);

	const tableData: DAOTableDataItem[] = useMemo(() => {
		if (!daoZnas?.length || !daos.length || daoZnas.length !== daos.length)
			return [];

		return daoZnas.map((zna, index) => {
			const dao: zDAO = daos[index];

			return {
				[TABLE_KEYS.TITLE]: dao.title,
				[TABLE_KEYS.ZNA]: zna,
				[TABLE_KEYS.DAO]: dao,
			};
		});
	}, [daoZnas, daos]);

	const fetchDAOs = useCallback(async () => {
		if (!sdk || !daoZnas) return;

		try {
			setIsLoading(true);
			setDaos([]);

			for (var i = 0; i < daoZnas.length; i++) {
				const zna = daoZnas[i];
				console.log('getting:', zna);
				const data = await sdk.getZDAOByZNA(zna);
				console.log('zDAO for zna:', data);
			}

			const daos: zDAO[] = await Promise.all(
				daoZnas.map((zna) => sdk.getZDAOByZNA(zna)),
			);

			setDaos(daos);
		} catch (e) {
			console.error(e);
		} finally {
			setIsLoading(false);
		}
	}, [sdk, daoZnas]);

	useUpdateEffect(fetchDAOs, [daoZnas]);

	return (
		<GenericTable
			alignments={[0, 1]}
			data={tableData}
			itemKey={TABLE_KEYS.ZNA}
			headers={HEADERS}
			rowComponent={DAOTableRow}
			gridComponent={DAOTableCard}
			isLoading={isLoading}
			loadingText={'Loading DAOs'}
			emptyText={'Could not find any DAOs'}
			searchKey={[TABLE_KEYS.TITLE, TABLE_KEYS.ZNA]}
			searchBy={'zNA'}
		/>
	);
};

export default DAOTable;
