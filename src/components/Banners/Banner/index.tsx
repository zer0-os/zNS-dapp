//- React Imports
import React from 'react';

//- Components Imports
import Banner from './Banner';

//- Hooks Imports
import useBannerData from './hooks/useBannerData';

const BannerContainer: React.FC = () => {
	const { data, background, isBanner } = useBannerData();

	if (!isBanner) {
		return <></>;
	}

	return (
		<Banner
			primaryText={data?.primaryText}
			secondaryText={data?.secondaryText}
			background={background}
			buttonText={data?.buttonText}
			onClick={() => {}}
		/>
	);
};

export default BannerContainer;
