//- React Imports
import React, { useState } from 'react'

//- Component Imports
import { Image, Overlay, Profile } from 'components'

//- Style Imports
import styles from './Member.module.css'

type MemberProps = {
    id: string;
    name: string;
    image: string;
    subtext?: string;
    showZna?: boolean;
}

const Member: React.FC<MemberProps> = ({ id, name, image, subtext, showZna }) => {

    const [ overlay, setOverlay ] = useState(false)

    const openProfile = () => {
        setOverlay(true)
    }

    return (
        <>
            {/* TODO: Remove overlay from child */}
            <Overlay centered open={overlay} onClose={() => setOverlay(false)}>
                <Profile id={id} />
            </Overlay>
            <div className={styles.Member}>
                <div 
                    className={styles.Image}
                >
                    <Image
                        onClick={openProfile}
                        src={image}
                    />
                </div>
                <div className={styles.Info}>
                    <span onClick={openProfile}>{ name }</span>
                    { subtext && <><br/><span>{ subtext }</span></> }
                    { showZna && <><br/><a onClick={openProfile}>wilder.{ name.toLowerCase().split(' ').join('.') }</a></> }
                </div>
            </div>
        </>
    )
}

export default Member