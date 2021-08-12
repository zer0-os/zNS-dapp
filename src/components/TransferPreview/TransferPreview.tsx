//- React Imports
import React from 'react';
import { Link } from 'react-router-dom';

//- Component Imports
import { Image } from 'components';

//- Hook Imports
import { useTransferProvider } from 'lib/providers/TransferProvider';

//- Style Imports
import styles from './TranferPreview.module.css';

const TransferPreview = () => {
	const { transferring } = useTransferProvider();

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
					<h5 className="glow-text-blue">{nft.name}</h5>

					<Link style={{ color: 'white' }} to={`${nft.domainName}`}>
						{nft.domainName.substring(1)}
					</Link>

					<p>is being transferred to:</p>
					<a
						href={'https://etherscan.io/address/' + nft.walletAddress}
						className={styles.Address}
						target="_blank"
						rel="noreferrer"
					>
						{nft.walletAddress}
					</a>

					<div>
						Transferring... <br />
						This may take up to 20 minutes
					</div>
				</div>
			</div>
		</li>
	);

	return (
		<div
			className={`${styles.TransferPreview} border-primary border-rounded blur`}
		>
			<h4 className="glow-text-white">Transfer In Progress</h4>
			<ul>
				{transferring.map((n: any) => nft(n, false))}
			</ul>
		</div>
	);
};

export default TransferPreview;
