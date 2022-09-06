//- React Imports
import React from 'react';
import { useHistory } from 'react-router-dom';

//- Components Imports
import Banner from './Banner';

//- Hooks Imports
import useBannerData from './hooks/useBannerData';

//- Utils Imports
import { isWilderWorldAppDomain } from 'lib/utils/url';

const BannerContainer: React.FC = () => {
	const history = useHistory();

	const {
		bannerContent: data,
		isBanner,
		isCountdown,
		onFinish,
		background,
	} = useBannerData();

	const onBannerClick = () => {
		if (data?.target?.type === 'url') {
			if (isWilderWorldAppDomain(data?.target?.value)) {
				history.push(data?.target?.value);
			} else {
				window.open(data?.target?.value, '_blank');
			}
		} else {
			return;
		}
	};

	// remove temp inline
	const padding = isBanner ? { padding: '0 0 16px 0 ' } : {};

	return (
		<div style={padding}>
			{isBanner && (
				<Banner
					primaryText={data?.primaryText}
					secondaryText={data?.secondaryText}
					background={background}
					buttonText={data?.buttonText}
					endTime={data?.endTime}
					isCountdown={isCountdown}
					onClick={onBannerClick}
					onFinish={onFinish}
				/>
			)}
		</div>
	);
};

export default BannerContainer;
