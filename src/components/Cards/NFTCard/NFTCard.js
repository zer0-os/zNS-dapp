import React from 'react'

import styles from './NFTCard.module.css'

const NFTCard = (props) => {
    return(
        <div className={`${styles.NFTCard} border-rounded`}>
            { props.showCreator && 
                <div className={styles.Creator}>
                    <div
                        style={{backgroundImage: `url(${props.NFT.creator.img})`}} 
                    ></div>
                    <span className={`glow-text-blue`}>{props.NFT.creator.name}</span>
                </div>
            }
            <h5 className={`glow-text-blue`}>{props.NFT.name}</h5>
            <div 
                className={styles.NFT}
                style={{backgroundImage: `url(${props.NFT.img})`}}
            >
            </div>
            <div className={styles.Foot}>
                <div>
                    <span className={`glow-text-blue`}>Last Traded Price</span>
                    <span className={`glow-text-blue`}>{props.NFT.price} WILD</span>
                </div>
                { props.showOwner &&
                    <div>
                        <span className={`glow-text-blue`}>Owned By</span>
                        <div className={styles.Creator}>
                            <div
                            style={{backgroundImage: `url(${props.NFT.owner.img})`}} 
                            ></div>
                            <span className={`glow-text-blue`}>{props.NFT.owner.name}</span>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default NFTCard