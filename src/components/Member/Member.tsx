//- React Imports
import React from 'react'

//- Component Imports
import { Image } from 'components'

//- Style Imports
import styles from './Member.module.css'

type MemberProps = {
    name: string;
    image: string;
    subtext?: string;

}

const Member: React.FC<MemberProps> = ({ name, image, subtext }) => {

    return (
        <div className={styles.Member}>
            <div 
                className={styles.Image}
            >
                <Image src={image} />
            </div>
            <div className={styles.Info}>
                <span>{ name }</span><br/>
                { subtext && <span>{ subtext }</span> }
            </div>
        </div>
    )
}

export default Member