import { useEffect, useState } from 'react';

import { Banner, Overlay } from 'components';
import { MintWheels } from 'containers';
import WaitlistRegistration from './WaitlistRegistration';
import RaffleRegistration from './RaffleRegistration';
import useAsyncEffect from 'use-async-effect';
import { getCurrentBlock } from 'lib/wheelSale';
import banner from '../../../components/Banners/Banner/assets/banner.gif';
import { getRaffleBannerLabel } from 'components/Banners/Banner/BannerLabels/Labels';
import { IndustryType } from 'components/Banners/Banner/utils';

const WheelsRaffleContainer = () => {
	//////////////////
	// State & Data //
	//////////////////

	const currentTime = new Date().getTime();

	// Temporary values
	// const RAFFLE_START_TIME = currentTime + 10000;
	// const RAFFLE_END_TIME = currentTime + 20000;
	// const SALE_START_TIME = currentTime + 10000;
	// const SALE_START_BLOCK = 13719840;

	// Hardcoded event times
	const RAFFLE_START_TIME = 1637870400000;
	const RAFFLE_END_TIME = 1638043200000;
	const SALE_START_TIME = 1638579600000;
	const SALE_START_BLOCK = 13719840;

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [currentBlock, setCurrentBlock] = useState<number>(0);

	const [hasRaffleStarted, setHasRaffleStarted] = useState<boolean>(
		currentTime >= RAFFLE_START_TIME,
	);
	const [hasRaffleEnded, setHasRaffleEnded] = useState<boolean>(
		currentTime >= RAFFLE_END_TIME,
	);
	const [hasSaleStarted, setHasSaleStarted] = useState<boolean>(false);
	const [hasSaleCountDownEnded, setHasSaleCountDownEnded] =
		useState<boolean>(false);

	const isMobile =
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test(
			navigator.userAgent,
		);
	const [windowWidth, setWindowWidth] = useState<number | undefined>();

	///////////////
	// Functions //
	///////////////

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const onFinishRaffleStartCountdown = () => {
		setHasRaffleStarted(true);
	};

	const onFinishRaffleEndCountdown = () => {
		setHasRaffleEnded(true);
	};

	const onFinishSaleStartCountdown = () => {
		setHasSaleCountDownEnded(true);
		setHasSaleStarted(currentBlock >= SALE_START_BLOCK);
	};

	const handleResize = () => {
		setWindowWidth(window.innerWidth);
	};

	const onBannerClick = () => {
		if (!hasRaffleEnded) {
			setIsModalOpen(true);
		} else {
			window.open(
				'https://zine.wilderworld.com/introducing-wilder-cribs-a-place-to-call-home-in-the-metaverse/',
				'_blank',
			);
		}
	};

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		window.addEventListener('resize', handleResize);
		handleResize();
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	useAsyncEffect(async () => {
		const { number: block } = await getCurrentBlock();
		setCurrentBlock(block);

		const interval = setInterval(async () => {
			const { number: block } = await getCurrentBlock();
			setHasSaleStarted(
				currentTime >= SALE_START_TIME && block >= SALE_START_BLOCK,
			);
			if (SALE_START_BLOCK >= block) {
				clearInterval(interval);
			}
		}, 13000);
		return () => clearInterval(interval);
	}, []);

	///////////////
	// Fragments //
	///////////////

	const bannerLabel = (industryType: IndustryType) => {
		return getRaffleBannerLabel(
			industryType,
			hasRaffleEnded,
			hasRaffleStarted,
			SALE_START_TIME,
			RAFFLE_END_TIME,
			RAFFLE_START_TIME,
			onFinishSaleStartCountdown,
			onFinishRaffleEndCountdown,
			onFinishRaffleStartCountdown,
		);
	};

	const bannerButtonLabel = () => {
		if (!hasRaffleStarted) {
			return 'Get Notified';
		} else if (!hasRaffleEnded) {
			return 'Enter Raffle';
		} else {
			return 'Sale Info';
		}
	};

	const bannerImage = () => {
		return banner;
	};

	const getBannerData = () => ({
		title: 'Get your ride for the Metaverse ',
		label: bannerLabel(IndustryType.CRIBS),
		buttonText: bannerButtonLabel(),
		bannerImageUrl: bannerImage(),
		bannerImageAlt: 'car in motion',
	});

	const overlay = () => {
		if (isMobile && hasRaffleStarted) {
			return (
				<Overlay open centered onClose={closeModal}>
					<p style={{ padding: 16, textAlign: 'center' }}>
						<b>Please use a desktop device to register</b>
					</p>
				</Overlay>
			);
		}
		if (hasRaffleStarted && windowWidth && windowWidth < 900) {
			return (
				<Overlay open centered onClose={closeModal}>
					<p style={{ padding: 16, textAlign: 'center' }}>
						<b>Please use a device with a larger viewport to register</b>
					</p>
				</Overlay>
			);
		}
		if (!hasRaffleStarted) {
			return (
				<Overlay open centered onClose={closeModal}>
					<WaitlistRegistration />
				</Overlay>
			);
		} else if (!hasRaffleEnded) {
			return (
				<Overlay open centered onClose={closeModal}>
					<RaffleRegistration />
				</Overlay>
			);
		}
	};

	////////////
	// Render //
	////////////

	if (!hasSaleCountDownEnded) {
		return (
			<>
				{isModalOpen && overlay()}
				<div>
					<Banner data={getBannerData()} onClick={onBannerClick} />
				</div>
			</>
		);
	}

	return <MintWheels />;
};

export default WheelsRaffleContainer;
