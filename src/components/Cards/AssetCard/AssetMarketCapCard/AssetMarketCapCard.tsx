import React from 'react'

import AssetCard from '../AssetCard'

import styles from './AssetMarketCapCard.module.css'

type AssetPriceCardProps = {
    style?: React.CSSProperties;
    title: string;
    price: number;
}

const AssetPriceCard: React.FC<AssetPriceCardProps> = ({ style, title, price }) => {

    return (
        <AssetCard
            style={style}
            title={title}
        >
            <h5 className={`${styles.price} glow-text-white`}>{`$${Number(price.toFixed(2)).toLocaleString()}`}</h5>
        </AssetCard>
    )
}

export default AssetPriceCard