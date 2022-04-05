import React from 'react';
import { Asset } from 'lib/types/dao';
import AssetsTable from './AssetsTable/AssetsTable';

type AssetsProps = {
	assets?: Asset[];
	isLoading: boolean;
};

const Assets: React.FC<AssetsProps> = ({ assets, isLoading }) => {
	return <AssetsTable assets={assets} isLoading={isLoading} />;
};

export default Assets;
