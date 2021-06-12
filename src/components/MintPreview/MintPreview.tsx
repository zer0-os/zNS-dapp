//- React Imports
import React from 'react';
import { Link } from 'react-router-dom';

//- Component Imports
import { Image } from 'components';

//- Hook Imports
import { useMintProvider } from 'lib/providers/MintProvider';

//- Style Imports
import styles from './MintPreview.module.css';

const MintPreview = () => {
	const { minting, minted } = useMintProvider();

	const nft = (nft: any, minted: boolean) => (
		<>
			<hr className="glow" />
			<li key={`${nft.name}${Math.random()}`}>
				<div className={`${styles.Image} border-rounded`}>
					<Link to={`${nft.zna}.${nft.domain}`}>
						<Image
							src={`data:image/png;base64,${nft.image.toString('base64')}`}
						/>
					</Link>
				</div>
				<div className={styles.Info}>
					<h5 className="glow-text-blue">{nft.name}</h5>

					{minted && (
						<Link to={`${nft.zna}.${nft.domain}`}>
							0://wilder.{nft.zna.substring(1)}.{nft.domain}
						</Link>
					)}

					{!minted && (
						<span style={{ color: 'var(--color-grey)', fontWeight: 700 }}>
							{nft.domain.length === 1
								? '0://wilder.'
								: `0://wilder.${nft.domain.substring(1)}`}
							{nft.name}
						</span>
					)}

					<p>{nft.story}</p>
					{minted && (
						<p style={{ color: 'var(--color-success)', fontWeight: 700 }}>
							Minting completed!
						</p>
					)}
				</div>
			</li>
		</>
	);

	return (
		<ul className={`${styles.MintPreview} border-primary border-rounded blur`}>
			<h4 className="glow-text-white">Minting</h4>
			{minting.map((n: any) => nft(n, false))}
			{minted.map((n: any) => nft(n, true))}
		</ul>
	);
};

export default MintPreview;
