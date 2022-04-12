import { useEffect, useState } from 'react';

import { MintDropNFTBanner, Overlay, Countdown } from 'components';
import { MintDropNFT } from 'containers';
import WaitlistRegistration from './WaitlistRegistration';
import RaffleRegistration from './RaffleRegistration';
import useAsyncEffect from 'use-async-effect';

const RaffleContainer = () => {
	//////////////////
	// State & Data //
	//////////////////

	const currentTime = new Date().getTime();

	// Temporary values
	const RAFFLE_START_TIME = currentTime - 20000;
	const RAFFLE_END_TIME = currentTime - 10000;
	const SALE_START_TIME = currentTime + 5000;
	const PRIVATE_SALE_END_TIME = currentTime + 10000;
	const PUBLIC_SALE_START_TIME = currentTime + 100000;
	// const SALE_START_BLOCK = 13719840;

	// Hardcoded event times
	// const RAFFLE_START_TIME = 1645819200000;
	// const RAFFLE_START_TIME = currentTime - 1000;
	// const RAFFLE_END_TIME = 1646078400000;
	// const SALE_START_TIME = 1649898000000;;
	// const PRIVATE_SALE_END_TIME = 1650070800000;
	// const PUBLIC_SALE_START_TIME = 1650074400000;

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const [hasRaffleStarted, setHasRaffleStarted] = useState<boolean>(
		currentTime >= RAFFLE_START_TIME,
	);
	const [hasRaffleEnded, setHasRaffleEnded] = useState<boolean>(
		currentTime >= RAFFLE_END_TIME,
	);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
		// setHasSaleStarted(currentBlock >= SALE_START_BLOCK);
	};

	const handleResize = () => {
		setWindowWidth(window.innerWidth);
	};

	const onBannerClick = () => {
		if (!hasRaffleEnded) {
			setIsModalOpen(true);
		} else {
			window.open(
				'https://zine.wilderworld.com/wolfpack-genesis-drop/',
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
		const interval = setInterval(async () => {
			setHasSaleStarted(Date.now() >= SALE_START_TIME);
			if (Date.now() >= SALE_START_TIME) {
				clearInterval(interval);
			}
		}, 13000);
		return () => clearInterval(interval);
	}, []);

	///////////////
	// Fragments //
	///////////////

	const bannerLabel = (): React.ReactNode => {
		if (hasRaffleEnded) {
			return (
				<>
					Mintlist Sale Begins in{' '}
					<b>
						<Countdown
							to={SALE_START_TIME}
							onFinish={onFinishSaleStartCountdown}
						/>
					</b>
				</>
			);
		} else if (hasRaffleStarted) {
			return (
				<>
					Mintlist Signup Period Ending in{' '}
					<b>
						<Countdown
							to={RAFFLE_END_TIME}
							onFinish={onFinishRaffleEndCountdown}
						/>
					</b>
				</>
			);
		} else {
			return (
				<>
					Get notified about the Wilder Beasts raffle - starting in{' '}
					<b>
						<Countdown
							to={RAFFLE_START_TIME}
							onFinish={onFinishRaffleStartCountdown}
						/>
					</b>
				</>
			);
		}
	};

	const bannerButtonLabel = () => {
		if (!hasRaffleStarted) {
			return 'Get Notified';
		} else if (!hasRaffleEnded) {
			return 'Sign up for Public Sale Mintlist';
		} else {
			return 'Learn More';
		}
	};

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
					<RaffleRegistration closeOverlay={closeModal} />
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
					<MintDropNFTBanner
						title={
							hasRaffleEnded
								? 'Join the Wilder Wolf Pack'
								: 'Join the Wilder Wolf Pack'
						}
						label={bannerLabel()}
						buttonText={bannerButtonLabel()}
						onClick={onBannerClick}
					/>
				</div>
			</>
		);
	}

	return (
		<MintDropNFT
			privateSaleEndTime={PRIVATE_SALE_END_TIME}
			publicSaleStartTime={PUBLIC_SALE_START_TIME}
		/>
	);
};

export default RaffleContainer;
