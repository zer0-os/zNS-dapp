import { useState, useMemo, useCallback } from 'react';
import { zDAO } from '@zero-tech/zdao-sdk';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { useZdaoSdk } from 'lib/dao/providers/ZdaoSdkProvider';
import { GenericTable } from 'components';
import DAOTableCard from './DAOTableCard';
import DAOTableRow from './DAOTableRow';

type DAOTableProps = {
	daoZnas?: string[];
};

enum TABLE_KEYS {
	TITLE = 'title',
	ZNA = 'zna',
	DAO = 'dao',
}

export type TableDataItem = {
	[TABLE_KEYS.TITLE]: string;
	[TABLE_KEYS.ZNA]: string;
	[TABLE_KEYS.DAO]: zDAO;
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

	const tableData: TableDataItem[] = useMemo(() => {
		if (!daoZnas?.length || !daos.length) return [];

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
