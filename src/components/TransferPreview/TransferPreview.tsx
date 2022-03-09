//- React Imports
import React from 'react';
import { Link } from 'react-router-dom';

//- Component Imports
import { Image } from 'components';

//- Hook Imports
import { useTransfer } from 'lib/hooks/useTransfer';

//- Constant Imports
import constants from './TransferPreview.constants';

//- Style Imports
import styles from './TranferPreview.module.scss';

//- Assets Imports
import questionMark from './assets/question-mark-icon.svg';

const TransferPreview = () => {
	const { transferring } = useTransfer();

	const nft = (nft: any, minted: boolean) => (
		<li key={`${nft.name}${Math.random()}`}>
			<hr className="glow" />
			<div>
				<div className={`${styles.Image} border-rounded`}>
					<Link to={`${nft.domainName}`}>
						<Image src={nft.image} />
					</Link>
				</div>
				<div className={styles.Info}>
					<h3 className="glow-text-white">{nft.name}</h3>

					<Link className={styles.Link} to={`${nft.domainName}`}>
						0://{nft.domainName.substring(1)}
					</Link>

					<p>{constants.MESSAGES.TRANSFERRING_TO}</p>
					<a
						href={constants.URLS.ACCOUNT_ETHERSCAN + nft.walletAddress}
						className={styles.Address}
						target="_blank"
						rel="noreferrer"
					>
						{nft.walletAddress}
					</a>

					<div className={styles.InfoContainer}>
						<div className={styles.IconContainer}>
							<img alt={constants.ALT_TEXT.QUESTION_MARK} src={questionMark} />
						</div>
						<div className={styles.TextContainer}>
							{constants.MESSAGES.TRANSFER_IN_PROGRESS} <br />
							{constants.MESSAGES.TRANSFER_TIME}
						</div>
					</div>
				</div>
			</div>
		</li>
	);

	return (
		<div
			className={`${styles.TransferPreview} border-primary border-rounded blur`}
		>
			<h4 className="glow-text-white">{constants.MESSAGES.TRANSFER_TITLE}</h4>
			<ul>{transferring.map((n: any) => nft(n, false))}</ul>
		</div>
	);
};

export default TransferPreview;
