import { FC, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useDomainStore } from '../../../lib/useDomainStore';
import { Modal } from 'antd';
import '../../css/profile.scss';
import elon from '../../css/img/elon.jpg';
import '../../css/profile-grid.scss';
import ClipboardButton from 'react-clipboard.js';
import qr from '../../css/img/qrcode-mockdata.png';

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
        <img src={elon} alt="" className="profilepic" onClick={showOwner} />
      ) : null}
      <Modal
        visible={isOwnedVisible}
        onOk={ownerOk}
        onCancel={ownerCancel}
        footer={null}
        width={'50vw'}
        bodyStyle={{
          height: '70vh',
          padding: '0',
          margin: '0',
        }}
        style={{
          position: 'relative',
        }}
      >
        <div className="profile-container">
          <div className="bottomTopContainer">
            <div className="header-container">
              <header className="profile-title profile-row">Profile</header>
            </div>

            <div className="profile-center-container">
              <div className="img-container">
                <div className="profile-img">
                  <img src={elon} alt="" />
                </div>
                {/* <div className="profile-text">
                  <div className="profile-name">Name</div>
                  <div className="profile-url">0::/etc</div>
                </div> */}
              </div>
              <div className="des-container">
                <div className="profile-des">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Aliquid ut tempore dolor maiores enim mollitia alias numquam
                  impedit quas ipsa odit laborum aut temporibus veritatis itaque
                  omnis sunt, quos vitae?{' '}
                </div>
              </div>
            </div>

            <div className="footer-container">
              <div className="footer-qr">
                <div className="qr">
                  <img src={qr} alt="" />
                </div>
              </div>
              <div className="footer-right">
                {/* <div className="ethLogo">Eth</div> */}
                <div className="footer-text">Your Ethereum Address</div>
                <div className="footer-address">
                  <div className="eth-btn">
                    <ClipboardButton
                      className="btn-43"
                      data-clipboard-text={account}
                      onSuccess={onSuccess}
                    >
                      {account}
                    </ClipboardButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Profile;
