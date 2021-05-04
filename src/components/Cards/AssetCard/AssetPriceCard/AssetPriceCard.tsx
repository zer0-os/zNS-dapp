import React from 'react'

import AssetCard from '../AssetCard' // Parent component

import styles from './AssetPriceCard.module.css' 

type AssetPriceCardProps = {
    style?: React.CSSProperties;
    title: string;
    price: number;
    change: number;
}

const AssetPriceCard: React.FC<AssetPriceCardProps> = ({ style, title, price, change }) => {

    return (
        <AssetCard
            style={style}
            title={title}
        >
            <h5 className={`${styles.price} glow-text-white`}>{`$${Number(price.toFixed(2)).toLocaleString()}`}</h5>
            <div className={styles.bottom}>
                <span>{`${Number(price.toFixed(4)).toLocaleString()} BTC`} </span>
                <span className={change > 0 ? styles.positive : styles.negative}>{`(${change >= 0 ? '+' : ''}${Number(change.toFixed(2)).toLocaleString()}%)`}</span>
            </div>
        </AssetCard>
    )
}

export default AssetPriceCard