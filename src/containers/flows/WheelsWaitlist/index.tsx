import { useEffect, useState } from 'react';

import { MintWheelsBanner, Overlay, Countdown } from 'components';
import WheelsWaitlist from './WheelsWaitlist';

const WheelsWaitlistContainer = () => {
	const countdownDate = 1634508000000;

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
	const [canOpen, setCanOpen] = useState<boolean>(true);

	const openModal = () => {
		if (canOpen) {
			setIsModalOpen(true);
		}
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const onFinishCountdown = () => {
		console.log('done');
	};

	const submitEmail = (email: string): Promise<boolean> => {
		return new Promise((resolve) => {
			fetch('https://zns-mail-microservice.herokuapp.com/wheels', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email: email }),
			})
				.then((r) => {
					resolve(r.ok);
					setHasSubmitted(true);
				})
				.catch((e) => {
					resolve(false);
					console.error(e);
				});
		});
	};

	const handleResize = () => {
		if (window.innerWidth >= 900) {
			setCanOpen(true);
		} else {
			setCanOpen(false);
			setIsModalOpen(false);
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

	///////////////
	// Fragments //
	///////////////

	const bannerLabel = (): React.ReactNode => {
		if (canOpen) {
			return (
				<>
					Get notified about the Wilder Wheels raffle launching in{' '}
					<b>
						<Countdown to={countdownDate} onFinish={onFinishCountdown} />
					</b>
				</>
			);
		} else {
			return (
				<>
					Wilder Wheels raffle launch starts in{' '}
					<b>
						<Countdown to={countdownDate} onFinish={onFinishCountdown} />
					</b>
				</>
			);
		}
	};

	////////////
	// Render //
	////////////

	return (
		<>
			{isModalOpen && (
				<Overlay open centered onClose={closeModal}>
					<WheelsWaitlist hasSubmitted={hasSubmitted} onSubmit={submitEmail} />
				</Overlay>
			)}
			<div style={{ position: 'relative', marginBottom: 16 }}>
				<MintWheelsBanner
					title={'Your ride for the Metaverse'}
					label={bannerLabel()}
					buttonText={canOpen ? 'Get Notified' : 'View First Drop'}
					onClick={openModal}
				/>
			</div>
		</>
	);
};

export default WheelsWaitlistContainer;
