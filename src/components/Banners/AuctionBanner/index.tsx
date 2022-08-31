//- React Imports
import React, { useEffect, useState } from 'react';

//- Utils Imports
import { AuctionBannerType, getContent } from './AuctionBanner.utils';

//- Banner Data
import AuctionBannerData from './AuctionBanner.data.json';
import AuctionBanner from './AuctionBanner';

const AuctionBannerContainer: React.FC = () => {
	const currentTime = new Date().getTime();
	const contentData: AuctionBannerType[] = AuctionBannerData;
	const [isCountdown, setIsCountdown] = useState<boolean>(false);
	const [data, setData] = useState<AuctionBannerType>();

	// set banner content
	useEffect(() => {
		// could replace / cutdown with hooks
		let isActive = true;

		const content = getContent(currentTime, contentData);
		console.log(content);
		setData(content);

		if (isActive) {
			if (currentTime < content?.auctionClosed.duration) {
				setIsCountdown(true);
			}
		}
	}, [contentData, currentTime]);

	const onCountdownFinish = () => {
		setIsCountdown(false);
	};

	console.log('current', currentTime);
	console.log('open', currentTime + 50000);
	console.log('end', currentTime * 50);

	//////////////////
	//    Render    //
	//////////////////

	return (
		<>
			{data && currentTime >= data.startTime && (
				<AuctionBanner
					data={data}
					currentTime={currentTime}
					isCountdown={isCountdown}
					onCountdownFinish={onCountdownFinish}
				/>
			)}
		</>
	);
};

export default AuctionBannerContainer;
