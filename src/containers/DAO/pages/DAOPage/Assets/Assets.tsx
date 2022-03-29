import AssetsTable from './AssetsTable/AssetsTable';
import { zDAOAssets } from '@zero-tech/zdao-sdk/lib/types';

type AssetsProps = {
	assets?: zDAOAssets;
	isLoading: boolean;
};

const Assets = ({ assets, isLoading }: AssetsProps) => {
	return <AssetsTable assets={assets} isLoading={isLoading} />;
};

export default Assets;
