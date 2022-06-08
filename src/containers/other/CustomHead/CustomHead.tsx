//-React Import
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

//- Library Imports
import { zNAFromPathname } from 'lib/utils';

//- Utils Imports
import { getHeadData } from './CustomHead.utils';

const CustomHead = () => {
	///////////
	// Data  //
	///////////
	const { pathname } = useLocation();
	const zna = zNAFromPathname(pathname);
	const data = getHeadData(zna);

	return (
		<Helmet>
			<title>{data?.title}</title>
			<link rel="icon" type="image/png" sizes="32x32" href={data?.iconLrg} />
			<link rel="icon" type="image/png" sizes="16x16" href={data?.iconSml} />
		</Helmet>
	);
};
export default CustomHead;
