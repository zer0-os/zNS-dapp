import { useState } from 'react';
import { FutureButton } from 'components';
import { MintDAO } from './MintDAO';

export const MintDAOButton: React.FC = () => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const onModalOpen = () => {
		setIsModalOpen(true);
	};

	const onModalClose = () => {
		setIsModalOpen(false);
	};

	return (
		<>
			<FutureButton glow onClick={onModalOpen}>
				Create a new DAO
			</FutureButton>

			{isModalOpen && <MintDAO onClose={onModalClose} />}
		</>
	);
};

export default MintDAOButton;
