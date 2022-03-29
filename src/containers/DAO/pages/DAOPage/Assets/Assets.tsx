import AssetsTable from './AssetsTable/AssetsTable';
import { Asset } from 'lib/types/dao';

type AssetsProps = {
	assets?: Asset[];
	isLoading: boolean;
};

const Assets = ({ assets, isLoading }: AssetsProps) => {
	return <AssetsTable assets={assets} isLoading={isLoading} />;
};

export default Assets;
