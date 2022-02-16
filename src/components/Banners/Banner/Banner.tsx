/* eslint-disable react-hooks/exhaustive-deps */
//- React Imports
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

//- Component Imports
import { BannerContent } from 'components';

//- Utils Imports
import { BannerContentType, getBannerContent } from './utils';
import { isWilderWorldAppDomain } from 'lib/utils/url';

//- Banner Data
import BannerData from './BannerData.json';

// interface BannerProps {
// 	setIsModalOpen: (state: boolean) => void;
// }

const Banner: React.FC = () => {
	//////////////////
	//    State     //
	//////////////////
	const [backgroundBlob, setBackgroundBlob] = useState<string | undefined>();
	const [shouldDisplayCountdown, setShouldDisplayCountdown] =
		useState<boolean>(false);
	const [bannerContent, setBannerContent] = useState<
		BannerContentType | undefined
	>();

	//////////////////
	//     Hooks    //
	//////////////////
	const history = useHistory();

	//////////////////
	//     Data     //
	//////////////////
	const currentTime = new Date().getTime();
	const contentData: BannerContentType[] = BannerData;

	// Get banner data
	const content = getBannerContent(currentTime, contentData);
	const title = bannerContent?.title;
	const subtext = bannerContent?.subtext;
	const timeToShow = bannerContent?.timeToShow;
	const timeToHide = bannerContent?.timeToHide;
	const countdownDate = bannerContent?.countdownDate;
	const actionText = bannerContent?.actionText;
	const action = bannerContent?.action;
	const contractAddress = bannerContent?.contractAddress;
	const link = bannerContent?.href;
	const imgAlt = bannerContent?.imgAlt;
	const imgUrl = bannerContent?.imgUrl;

	//////////////////
	//    Effects   //
	//////////////////

	// Set banner content
	useEffect(() => {
		if (!content) {
			// Set banner content as undefined
			setBannerContent(undefined);
		}
		// Set banner content as getBannerContent result
		setBannerContent(content);
	}, [content]);

	// Set background image
	useEffect(() => {
		if (!imgUrl) {
			return;
		}

		let isMounted = true;

		fetch(imgUrl)
			.then((r) => r.blob())
			.then((blob) => {
				if (isMounted) {
					const url = URL.createObjectURL(blob);
					setBackgroundBlob(url);
				}
			});
		return () => {
			isMounted = false;
		};
	}, [imgUrl]);

	// Set Countdown
	useEffect(() => {
		if (countdownDate && timeToHide) {
			if (currentTime >= timeToHide) {
				const content = getBannerContent(currentTime, contentData);
				setBannerContent(content);
			}
		}
	}, []);

	//////////////////
	//   Functions  //
	//////////////////

	const handleOpenModal = () => {
		console.log('OPEN MODAL');
		// if (contractAddress === wheelSale) {
		// 	setModalContent(Modal.Wheels)
		// } else if (contractAddress === cribSale) {
		// 	setModalContent(Modal.Cribs)
		// }  else if (contractAddress === kickSale) {
		// 	setModalContent(Modal.Kicks)
		// } else if (contractAddress === craftSale) {
		// 	setModalContent(Modal.Crafts)
		// } else if (contractAddress === landSale) {
		// 	setModalContent(Modal.Land)
		// } else {
		// 	setModalContent(Modal.Pets)
		// }
		// setIsModalOpen(true)
	};

	// Get banner click event
	const onBannerClick = () => {
		if (link && action === 'link') {
			if (!isWilderWorldAppDomain(link)) {
				window.open(link, '_blank');
			} else {
				history.push(link);
			}
		} else if (contractAddress && action === 'modal') {
			handleOpenModal();
		} else {
			return;
		}
	};

	const onFinish = () => {};

	//////////////////
	//    Render    //
	//////////////////

	return (
		<>
			<BannerContent
				title={title}
				subtext={subtext}
				timeToShow={timeToShow}
				timeToHide={timeToHide}
				countdownDate={countdownDate}
				actionText={actionText}
				backgroundBlob={backgroundBlob}
				imgAlt={imgAlt}
				shouldDisplayCountdown={shouldDisplayCountdown}
				onClick={onBannerClick}
				onFinish={onFinish}
			/>
		</>
	);
};

export default Banner;
