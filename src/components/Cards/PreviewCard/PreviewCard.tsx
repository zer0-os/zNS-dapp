//- React imports
import React from 'react'

//- Style Imports
import styles from './PreviewCard.module.css'

//- Library Imports
import { randomName, randomImage } from 'lib/Random'

//- Component Imports
import {
    AssetGraphCard,
    AssetMarketCapCard,
    AssetPriceCard,
    FutureButton, 
    Image,
    Member,
    HorizontalScroll,
} from 'components'


type PreviewCardProps = {
    image: string;
    style?: React.CSSProperties;
    name: string;
    domain: string;
    description: string;
    creatorId: string;
    ownerId: string;
    isLoading: boolean;
    children?: React.ReactNode;
}

const PreviewCard: React.FC<PreviewCardProps> = ({ image, style, name, domain, description, creatorId, ownerId, isLoading, children }) => {

    // TODO: Work out how the data for the asset cards should be passed in
    // Would it actually make more sense to have the bottom row of the preview card be whatever
    // is passed in as a child?

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
                    <div className={styles.Preview}>
                        <div 
                        className={styles.Asset}
                        >
                            <Image src={image} />
                        </div>
                        <div className={styles.Body}>
                            <div>
                                <h5>{name ? name : domain.split('/')[1]}</h5>
                                <span className={styles.Domain}>{domain}</span>
                                <p>{description}</p>
                            </div>
                            <div className={styles.Members}>
                                {/* TODO: Switch these to Member component */}
                                <Member
                                    name={randomName(creatorId)}
                                    image={randomImage(creatorId)}
                                    subtext={'Creator'}
                                />
                                <Member
                                    name={randomName(ownerId)}
                                    image={randomImage(ownerId)}
                                    subtext={'Owner'}
                                />
                            </div>
                        </div>
                        <div className={styles.Buy}>
                            <FutureButton glow onClick={() => console.log('hello')} style={{height: 36, width: 118, borderRadius: 30}}>ENLIST</FutureButton>
                            {/* <span className={`glow-text-blue`}>Last Offer</span>
                            <span className={`glow-text-white`}>W1.56 <span className={`glow-text-blue`}>($8,000)</span></span> */}
                        </div>
                    </div>
                    { children &&
                        <>
                            <hr className='glow' />
                            <div className={styles.Children}>
                                { children }
                            </div>
                        </>
                    }
                </>
            }
            
        </div>
    )
}

export default PreviewCard