import { Overlay, Profile } from 'components';
import { useHistory, useLocation } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';

const ProfileModal = () => {
	const history = useHistory();
	const location = useLocation();
	const { account } = useWeb3React();
	const params = new URLSearchParams(location.search);

	const closeModal = () => {
		params.delete('profile');
		history.push({
			pathname: location.pathname,
			search: params.toString(),
		});
	};

	const onNavigate = (to: string) => {
		params.delete('profile');
		history.push({
			pathname: to,
			search: params.toString(),
		});
	};

	if (params.get('profile') && account !== undefined) {
		return (
			<Overlay fullScreen centered open onClose={closeModal}>
				<Profile yours id={account!} onNavigate={onNavigate} />
			</Overlay>
		);
	}
	return <></>;
};

export default ProfileModal;
