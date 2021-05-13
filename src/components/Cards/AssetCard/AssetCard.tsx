import React from 'react'

import styles from './AssetCard.module.css'

type AssetCardProps = {
    style?: React.CSSProperties;
    title: string;
    children: React.ReactNode;
}

const AssetCard: React.FC<AssetCardProps> = ({ style, title, children }) => {
    return(
        <div style={style} className={`${styles.AssetCard} border-rounded blur`}>
            <div style={{display: 'flex'}}>
                <h4 className='glow-text-blue'>{title}</h4><button className={styles.infoButton}></button>
            </div>
            { children }
        </div>
    )
}

export default AssetCard