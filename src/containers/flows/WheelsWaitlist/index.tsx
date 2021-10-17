import { useState } from 'react';

import { MintWheelsBanner, Overlay, Countdown } from 'components';
import WheelsWaitlist from './WheelsWaitlist';

const WheelsWaitlistContainer = () => {
	const countdownDate = 1634508000000;

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

	const openModal = () => {
		setIsModalOpen(true);
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

	///////////////
	// Fragments //
	///////////////

	const bannerLabel = (): React.ReactNode => {
		return (
			<>
				Get notified about the Wilder Wheels raffle - starting in{' '}
				<b>
					<Countdown to={countdownDate} onFinish={onFinishCountdown} />
				</b>
			</>
		);
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
					title={'Guarantee your ride for the Metaverse'}
					label={bannerLabel()}
					buttonText={'Get Notified'}
					onClick={openModal}
				/>
			</div>
		</>
	);
};

export default WheelsWaitlistContainer;
