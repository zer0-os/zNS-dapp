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

const Banner: React.FC = () => {
	//////////////////
	//     Hooks    //
	//////////////////

	const history = useHistory();

	//////////////////
	//     Data     //
	//////////////////

	const currentTime = new Date().getTime();
	const contentData: BannerContentType[] = BannerData;

	//////////////////
	//    State     //
	//////////////////

	const [backgroundBlob, setBackgroundBlob] = useState<string | undefined>();
	const [shouldDisplayBanner, setShouldDisplayBanner] = useState<boolean>(true);
	const [shouldDisplayCountdown, setShouldDisplayCountdown] =
		useState<boolean>(false);
	const [bannerContent, setBannerContent] = useState<
		BannerContentType | undefined
	>();

	//////////////////
	//    Effects   //
	//////////////////
	console.log('currentTime', currentTime);
	console.log(currentTime + 3 * 60 * 1000);

	// Set banner
	useEffect(() => {
		let isActive = true;

		const content = getBannerContent(currentTime, contentData);
		setBannerContent(content);

		if (isActive) {
			console.log('console.log(bannerContent);');
			if (!bannerContent) {
				setShouldDisplayBanner(false);
				console.log('NO DATA');
			} else {
				setShouldDisplayBanner(true);
				if (
					bannerContent.countdownDate &&
					currentTime < bannerContent.countdownDate
				) {
					setShouldDisplayCountdown(true);
				}
			}
		}
	}, [bannerContent, contentData, currentTime]);

	// Set background image
	useEffect(() => {
		if (!bannerContent?.imgUrl) {
			return;
		}

		let isMounted = true;

		fetch(bannerContent.imgUrl)
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
	}, [bannerContent?.imgUrl]);

	//////////////////
	//   Functions  //
	//////////////////

	// const handleOpenModal = () => {
	// 	console.log('OPEN MODAL');
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
	// };

	const onCountDownFinish = () => {
		setShouldDisplayCountdown(false);
	};

	const onBannerClick = () => {
		if (bannerContent?.href && bannerContent.action === 'link') {
			if (!isWilderWorldAppDomain(bannerContent?.href)) {
				window.open(bannerContent?.href, '_blank');
			} else {
				history.push(bannerContent?.href);
			}
		} else {
			return;
		}
	};

	//////////////////
	//    Render    //
	//////////////////

	return (
		<div style={{ paddingTop: '16px' }}>
			{shouldDisplayBanner && bannerContent ? (
				<BannerContent
					title={bannerContent.title}
					subtext={bannerContent.subtext}
					countdownDate={bannerContent.countdownDate}
					actionText={bannerContent.actionText}
					backgroundBlob={backgroundBlob}
					imgAlt={bannerContent.imgAlt}
					onClick={onBannerClick}
					onFinish={onCountDownFinish}
					shouldDisplayCountdown={shouldDisplayCountdown}
				/>
			) : (
				<div style={{ marginTop: '-16px' }}>{null}</div>
			)}
		</div>
	);
};

export default Banner;
