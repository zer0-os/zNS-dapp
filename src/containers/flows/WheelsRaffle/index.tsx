import { useEffect, useState } from 'react';

import { MintWheelsBanner, Overlay, Countdown } from 'components';
import { MintWheels } from 'containers';
import WaitlistRegistration from './WaitlistRegistration';
import RaffleRegistration from './RaffleRegistration';

const WheelsRaffleContainer = () => {
	//////////////////
	// State & Data //
	//////////////////

	const currentTime = new Date().getTime();
	// Hardcoded event times
	const RAFFLE_START_TIME = 1634408000000;
	const RAFFLE_END_TIME = 1635112800000;

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const [hasRaffleStarted, setHasRaffleStarted] = useState<boolean>(
		currentTime >= RAFFLE_START_TIME,
	);
	const [hasRaffleEnded, setHasRaffleEnded] = useState<boolean>(
		currentTime >= RAFFLE_END_TIME,
	);

	const isMobile =
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test(
			navigator.userAgent,
		);
	const [windowWidth, setWindowWidth] = useState<number | undefined>();

	///////////////
	// Functions //
	///////////////

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const onFinishRaffleStartCountdown = () => {
		setHasRaffleStarted(true);
	};

	const onFinishRaffleEndCountdown = () => {
		setHasRaffleEnded(true);
	};

	const handleResize = () => {
		setWindowWidth(window.innerWidth);
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

	///////////////
	// Fragments //
	///////////////

	const bannerLabel = (): React.ReactNode => {
		if (hasRaffleEnded) {
			return <>Wilder Wheels raffle has ended</>;
		} else if (hasRaffleStarted) {
			return (
				<>
					Join the whitelist raffle. Early sale starts in{' '}
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
					Get notified about the Wilder Wheels raffle - starting in{' '}
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
			return 'Enter Raffle';
		} else {
			return 'Mint Wheels';
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
					<RaffleRegistration />
				</Overlay>
			);
		}
	};

	////////////
	// Render //
	////////////

	if (!hasRaffleEnded) {
		return (
			<>
				{isModalOpen && overlay()}
				<div style={{ position: 'relative', marginBottom: 16 }}>
					<MintWheelsBanner
						title={'Get Early Access to Wilder Wheels'}
						label={bannerLabel()}
						buttonText={bannerButtonLabel()}
						onClick={openModal}
					/>
				</div>
			</>
		);
	}

	return <MintWheels />;
};

export default WheelsRaffleContainer;
