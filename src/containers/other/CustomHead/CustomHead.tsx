//-React Import
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

//- Library Imports
import { zNAFromPathname } from 'lib/utils';

//- Utils Imports
import { getHeadData, HeadDataType } from './CustomHead.utils';

const CustomHead = () => {
	///////////
	// Data  //
	///////////
	const isMounted = useRef<boolean>();
	const { pathname } = useLocation();
	const zna = zNAFromPathname(pathname);
	const [data, setData] = useState<HeadDataType>();

	/////////////
	// Effects //
	/////////////
	useEffect(() => {
		isMounted.current = true;
		const headData = getHeadData(zna);
		setData(headData);
		return () => {
			isMounted.current = false;
		};
	}, [zna]);

	return (
		<Helmet>
			<title>{data?.title}</title>
			<link
				id="faviconLrg"
				rel="icon"
				type="image/png"
				sizes="32x32"
				href={data?.iconLrg}
			/>
			<link
				id="faviconSml"
				rel="icon"
				type="image/png"
				sizes="16x16"
				href={data?.iconSml}
			/>
		</Helmet>
	);
};
export default CustomHead;
