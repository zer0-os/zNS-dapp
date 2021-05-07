import React from 'react'

import styles from './PreviewCard.module.css'

import { FutureButton } from 'components'

type PreviewCardProps = {
    nftImageData: string;
    style?: React.CSSProperties;
    name: string;
    domain: string;
    description: string;
    creatorId: string;
    ownerId: string;
    isLoading: boolean;
}

const PreviewCard: React.FC<PreviewCardProps> = ({ nftImageData, style, name, domain, description, creatorId, ownerId, isLoading }) => {

    return(
        <div 
            className={`${styles.PreviewCard} border-primary border-rounded blur`}
            style={style ? style : {}}
        >
            {
                isLoading &&
                <div className={styles.Loading}>
                    <div className={styles.Spinner}></div>
                </div>
            }
            { !isLoading &&
                <>
                    <div 
                    className={styles.Asset}
                    style={{backgroundImage: `url(${nftImageData})`}}
                    >
                    </div>
                    <div className={styles.Body}>
                        <div>
                            <h5 className={'glow-text-blue'}>{name}</h5>
                            <span className={styles.Domain}>{domain}</span>
                        </div>
                        <p>{description}</p>
                        <div className={styles.Members}>
                            <div>
                                <div 
                                    className={styles.Dp}
                                    // style={{backgroundImage: `url(${props.creator.img})`}}
                                ></div>
                                <div className={styles.Member}>
                                    <span>{ creatorId }</span><br/>
                                    <span>Creator</span>
                                </div>
                            </div>
                            <div>
                                <div 
                                    className={styles.Dp}
                                    // style={{backgroundImage: `url(${props.owner.img})`}}
                                ></div>
                                <div className={styles.Member}>
                                    <span>{ ownerId }</span><br />
                                    <span>Owner</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.Buy}>
                        <FutureButton glow onClick={() => console.log('hello')} style={{height: 36, width: 118, borderRadius: 30}}>BUY</FutureButton>
                        <span className={`glow-text-blue`}>Last Offer</span>
                        <span className={`glow-text-white`}>W1.56 <span className={`glow-text-blue`}>($8,000)</span></span>
                    </div>
                </>
            }
            
        </div>
    )
}

export default PreviewCard