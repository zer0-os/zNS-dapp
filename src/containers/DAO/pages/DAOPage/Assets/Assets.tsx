import useDaoAssets from './hooks/useDaoAssets';
import AssetsTable from './AssetsTable/AssetsTable';

const Assets = () => {
	const { assets, isLoading } = useDaoAssets('test');

	return <AssetsTable assets={assets} isLoading={isLoading} />;
};

export default Assets;
