import React, { useState } from 'react'

import styles from './ProfileButton.module.css'

const ProfileButton = (props) => {

    return(
        <button 
            style={props.style}
            className={styles.ProfileButton}
        >
            <img src={props.icon} />
        </button>
    )
}

export default ProfileButton