import React from 'react'

import styles from './PreviewCard.module.css'

import { FutureButton } from 'components'

const PreviewCard = (props) => {

    return(
        <div 
            className={`${styles.PreviewCard} border-primary border-rounded blur`}
            style={props.style}
        >
            <div 
                className={styles.Asset}
                style={{backgroundImage: `url(${props.img})`}}
            >
            </div>
            <div className={styles.Body}>
                <div>
                    <h5 className={'glow-text-blue'}>{props.name}</h5>
                    <span className={styles.Domain}>{props.domain}</span>
                </div>
                <p>{props.description}</p>
                <div className={styles.Members}>
                    <div>
                        <div 
                            className={styles.Dp}
                            style={{backgroundImage: `url(${props.creator.img})`}}
                        ></div>
                        <div className={styles.Member}>
                            <span>{props.creator.domain}</span><br/>
                            <span>Creator</span>
                        </div>
                    </div>
                    <div>
                        <div 
                            className={styles.Dp}
                            style={{backgroundImage: `url(${props.owner.img})`}}
                        ></div>
                        <div className={styles.Member}>
                            <span>{props.owner.domain}</span><br />
                            <span>Owner</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.Buy}>
                <FutureButton style={{height: 36, width: 118, borderRadius: 30}}>BUY</FutureButton>
                <span className={`glow-text-blue`}>Last Offer</span>
                <span className={`glow-text-white`}>W1.56 <span className={`glow-text-blue`}>($8,000)</span></span>
            </div>
        </div>
    )
}

export default PreviewCard