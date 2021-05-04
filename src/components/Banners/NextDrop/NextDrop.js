import React, { useState, useEffect } from 'react'

import styles from './NextDrop.module.css'

import avatar from './assets/avatar.png'
import wilder from './assets/wilder.jpg'

const NextDrop = (props) => {

    const calculateTimeLeft = () => {
        const today = new Date()

        const difference = props.date - today;

        if(!difference) return

        return {
            seconds: Math.floor((difference / 1000) % 60),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            hours: Math.floor(difference / (1000 * 60 * 60)) 
        }
    }

    const [ timeLeft, setTimeLeft ] = useState(calculateTimeLeft())
    const [year] = useState(new Date().getFullYear());

    useEffect(() => {
        setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
    });

    return (
        <div style={{...props.style}} className={`${styles.nextDrop} border-primary border-rounded blur`}>
            <img src={avatar} />
            <div>
                <div>
                    <h5 className='glow-text-blue'>Next Drop in <span>{timeLeft.hours ? timeLeft.hours + ':' : ''}{timeLeft.minutes ? timeLeft.minutes + ':' : ''}{timeLeft.seconds ? timeLeft.seconds : ''}</span></h5>
                </div>
                <div>
                    <p className='glow-text-blue'>A new artwork '<span>{props.title}</span>' by '<span>{props.artist}</span>' is dropping soon.</p> 
                </div>
            </div>
        </div>
    )
}

export default NextDrop