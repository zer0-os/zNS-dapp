//- React Imports
import React, { useMemo, useCallback } from 'react';

//- Web3 Imports
import { BigNumber } from 'ethers';

//- Component Imports
import { ArrowLink } from 'components';

//- Library Imports
import { getHashFromIPFSUrl, getWebIPFSUrlFromHash } from 'lib/ipfs';
import { chainIdToNetworkType, getEtherscanUri } from 'lib/network';
import { useZnsContracts } from 'lib/contracts';
import useNotification from 'lib/hooks/useNotification';

//- Type Imports
import { Maybe, DisplayParentDomain } from 'lib/types';

//- Helper Imports
import { copyToClipboard, truncateText } from '../../NFTView.helpers';

//- Asset Imports
import copyIcon from '../../assets/copy-icon.svg';

//- Style Imports
import styles from '../../NFTView.module.scss';

//- Componennt level type definitions
type TokenHashBoxesProps = {
	domainId: string;
	chainId?: number;
	znsDomain: Maybe<DisplayParentDomain>;
};

export const TokenHashBoxes: React.FC<TokenHashBoxesProps> = ({
	domainId,
	chainId,
	znsDomain,
}) => {
	const contracts = useZnsContracts();
	const { addNotification } = useNotification();

	const ipfsHash = useMemo(() => {
		if (znsDomain) {
			return getHashFromIPFSUrl(znsDomain.metadata);
		}

		return '';
	}, [znsDomain]);

	const etherscanLink = useMemo(() => {
		const domainIdInteger = BigNumber.from(domainId);
		const networkType = chainIdToNetworkType(chainId);
		const etherscanBaseUri = getEtherscanUri(networkType);
		const registrarAddress = contracts ? contracts.registry.address : '';

		return `${etherscanBaseUri}token/${registrarAddress}?a=${domainIdInteger.toString()}`;
	}, [domainId, chainId, contracts]);

	const onCopyToClipboard = useCallback(
		(content: string, label: string) => () => {
			copyToClipboard(content);
			addNotification(`Copied ${label} to clipboard.`);
		},
		[addNotification],
	);

	return (
		<div className={`${styles.TokenHashContainer}`}>
			<div
				className={`${styles.Box} ${styles.Contract} blur border-primary border-rounded`}
			>
				<h4>Token Id</h4>
				<p>
					<img
						onClick={onCopyToClipboard(domainId, 'Token ID')}
						className={styles.Copy}
						src={copyIcon}
						alt="Copy Contract Icon"
					/>
					{truncateText(domainId, 18)}
				</p>
				<ArrowLink
					style={{
						marginTop: 8,
						width: 150,
					}}
					href={etherscanLink}
				>
					View on Etherscan
				</ArrowLink>
			</div>
			<div
				className={`${styles.Box} ${styles.Contract} blur border-primary border-rounded`}
			>
				<h4>IPFS Hash</h4>
				<p>
					<img
						onClick={onCopyToClipboard(ipfsHash, 'IPFS Hash')}
						className={styles.Copy}
						src={copyIcon}
						alt="Copy IPFS Hash Icon"
					/>
					{truncateText(ipfsHash, 15)}
				</p>
				<ArrowLink
					style={{
						marginTop: 8,
						width: 105,
					}}
					href={getWebIPFSUrlFromHash(ipfsHash)}
				>
					View on IPFS
				</ArrowLink>
			</div>
		</div>
	);
};

export default TokenHashBoxes;
