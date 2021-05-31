import React from 'react';

import AssetCard from '../AssetCard';
import { TextButton } from 'components';

import styles from './AssetGraphCard.module.css';

import graph from './assets/graph-template.svg';

type AssetGraphCardProps = {
	title: string;
	style?: React.CSSProperties;
};

const AssetGraphCard: React.FC<AssetGraphCardProps> = ({ title, style }) => {
	return (
		<AssetCard style={style} title={title}>
			<div className={styles.filters}>
				<TextButton toggleable={true}>D</TextButton>
				<TextButton toggleable={true}>M</TextButton>
				<TextButton toggleable={true}>Y</TextButton>
			</div>
			<img alt="asset graph" className={styles.graph} src={graph} />
		</AssetCard>
	);
};

export default AssetGraphCard;
