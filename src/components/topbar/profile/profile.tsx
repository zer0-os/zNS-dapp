import { FC, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
// import { useDomainStore } from '../../../lib/useDomainStore';
import { Modal } from 'antd';
import './css/profile.scss';
import './css/profile-grid.scss';
import ClipboardButton from 'react-clipboard.js';
// import qr from '../../css/img/qrcode-mockdata.png';
import wilderavatar from '../../css/img/wilderavatar.png';
import zero from '../../css/img/zero.jpeg';
import { useDomainStore } from '../../../lib/useDomainStore';

import ProfileNew from '../../Profile/Profile.js';

const Profile: FC = () => {
  const context = useWeb3React<Web3Provider>();
  const [isOwnedVisible, setOwnedVisible] = useState(false);

  const { owned } = useDomainStore();

  const { account } = context;

  const showOwner = () => {
    setOwnedVisible(true);
  };

  const ownerOk = () => {
    setOwnedVisible(false);
  };

  const ownerCancel = () => {
    setOwnedVisible(false);
  };

  const onSuccess = () => {
    return 'Coppied';
  };

  // const copyFunction = () => {
  //   let copyAccount = document.getElementById('account');
  //   copyAccount?.onselect;
  //   document.execCommand('copy');
  // };

  if (owned.isNothing()) return null;

  return (
    <>
      {owned.isJust() ? (
        <img
          src={wilderavatar}
          alt=""
          className="profilepic"
          onClick={showOwner}
        />
      ) : null}
      <Modal
        visible={isOwnedVisible}
        onOk={ownerOk}
        onCancel={ownerCancel}
        footer={null}
        width={'90vw'}
        bodyStyle={{
          // height: '50vh',
          padding: '0',
          paddingBottom: '25px',
          margin: '0',
        }}
        style={{
          position: 'relative',
        }}
      >
        <ProfileNew
        // name={name}
        />
      </Modal>
    </>
  );
};

export default Profile;
