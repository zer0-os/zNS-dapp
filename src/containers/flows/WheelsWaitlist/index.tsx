import { useState } from 'react';

import { MintWheelsBanner, Overlay } from 'components';
import WheelsWaitlist from './WheelsWaitlist';

const WheelsWaitlistContainer = () => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
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

	return (
		<>
			{isModalOpen && (
				<Overlay open onClose={closeModal}>
					<WheelsWaitlist hasSubmitted={hasSubmitted} onSubmit={submitEmail} />
				</Overlay>
			)}
			<div style={{ position: 'relative', marginBottom: 16 }}>
				<MintWheelsBanner
					title={'Guarantee your ride for the Metaverse'}
					label={'Get notified about the Wilder Wheel raffle launching in'}
					buttonText={'Get Notified'}
					onClick={openModal}
				/>
			</div>
		</>
	);
};

export default WheelsWaitlistContainer;
