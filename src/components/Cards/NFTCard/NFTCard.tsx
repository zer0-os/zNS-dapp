//- React Imports
import React from 'react'

//- Style Imports
import styles from './NFTCard.module.css'

//- Component Imports
import { Image } from 'components'

type NFTCardProps = {
    name: string;
    imageUri: string;
    price: number;
    nftOwnerId: string;
    nftMinterId: string;
    showCreator?: boolean;
    showOwner?: boolean;
    style?: React.CSSProperties;
}

const NFTCard: React.FC<NFTCardProps> = ({ name, imageUri, price, nftOwnerId, nftMinterId, showCreator, showOwner, style }) => {
    return(
        <div style={style ? style : {}} className={`${styles.NFTCard} border-rounded`}>
            { showCreator && 
                <div className={styles.Creator}>
                    <div
                        style={{backgroundImage: `url(assets/dp/fake03.jpg)`}} 
                    ></div>
                    <span className={`glow-text-blue`}>{nftMinterId}</span>
                </div>
            }
            <h5 className={`glow-text-blue`}>{name}</h5>
            <Image 
                className={styles.NFT}
                style={{height: 348, width: 348}}
                src={''}
            />
            <div className={styles.Foot}>
                <div>
                    <span className={`glow-text-blue`}>Last Traded Price</span>
                    <span className={`glow-text-blue`}>{Number(price).toLocaleString()} WILD</span>
                </div>
                { showOwner &&
                    <div>
                        <span className={`glow-text-blue`}>Owned By</span>
                        <div className={styles.Creator}>
                            <div
                            style={{backgroundImage: `url(assets/dp/fake05.jpg)`}} 
                            ></div>
                            <span className={`glow-text-blue`}>{nftOwnerId}</span>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default NFTCard