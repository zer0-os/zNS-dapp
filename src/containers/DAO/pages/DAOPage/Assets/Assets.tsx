import React, { memo } from 'react';
import { Asset } from 'lib/types/dao';
import AssetsTable from './AssetsTable/AssetsTable';

type AssetsProps = {
	assets?: Asset[];
	safeAddress?: string;
	isLoading: boolean;
};

const Assets: React.FC<AssetsProps> = ({ assets, safeAddress, isLoading }) => {
	return (
		<AssetsTable
			assets={assets}
			safeAddress={safeAddress}
			isLoading={isLoading}
		/>
	);
};

export default memo(Assets);
