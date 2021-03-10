import { FC, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useZnsContracts } from '../../../lib/contracts';
import { useDomainStore } from '../../../lib/useDomainStore';
import { Modal } from 'antd';
import { useLocation } from 'react-router-dom';
import '../../css/profile.scss';
import elon from '../../css/img/elon.jpg';
import '../../css/profile-grid.scss';
import ClipboardButton from 'react-clipboard.js';

const Profile: FC = () => {
  const context = useWeb3React<Web3Provider>();
  const [isOwnedVisible, setOwnedVisible] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [text, setText] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [count, setCount] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [size, setSize] = useState();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const contracts = useZnsContracts();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { owned, incomingApprovals } = useDomainStore();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const location = useLocation();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { library, account, active, chainId } = context;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dataInput = account;

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
      <img src={elon} alt="" className="profilepic" onClick={showOwner} />

      <Modal
        visible={isOwnedVisible}
        getContainer={false}
        maskStyle={{}}
        onOk={ownerOk}
        onCancel={ownerCancel}
        footer={null}
        width="50vw"
        bodyStyle={{
          height: '70vh',
          padding: '0',
          margin: '0',
        }}
      >
        <div className="profile-container">
          <div className="bottomTopContainer">
            <div className="header-container">
              <header className="profile-title profile-row">Profile</header>
            </div>

            <div className="profile-center-container">
              <div className="img-container">
                <div className="profile-img">image</div>
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
                <div className="qr"></div>
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
