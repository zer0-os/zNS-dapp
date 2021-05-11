//- React imports
import React, { useState, useEffect } from 'react'

//- Web Imports
import { useDomainCache } from 'lib/useDomainCache'

//- Style Imports
import CopyInput from '../CopyInput/CopyInput.js'
import ProfileStyle from './Profile.module.css'

//- Component Imports
import { Image } from 'components'

//- Container Imports
import { Shop } from 'containers'

//- Library Imports
import { randomName, randomImage } from 'lib/Random'

//- Asset Imports
import qr from './assets/qr.png'
import eth from './assets/eth.svg'
import dp from './assets/wilder.jpg'

type ProfileProps = {
	id: string;
}

const Profile: React.FC<ProfileProps> = ({ id }) => {

	return (
		<div className={`${ProfileStyle.profile} blur border-primary border-rounded`}>
			{/* <h1 className={`glow-text-white`}>Profile</h1> */}
			<div className={ProfileStyle.body}>
				<div>
					<Image className={ProfileStyle.dp} src={randomImage(id)} />
					<a className={`${ProfileStyle.endpoint} glow-text-blue`}>0://{ randomName(id).toLowerCase().split(' ').join('.') }</a>
				</div>
				<div>
					<span className={`${ProfileStyle.name} glow-text-blue`}>{ randomName(id) }</span>
					<p>Hey I’m { randomName(id) } and I like staring into the night sky and imagining myself in another galaxy. I’m so passionate about space travel that I spend the majority of my time making animated short films about it. With the magic of CGI, I can make worlds and journeys so real that I can almost taste the synthetic beef that comes out of the assembler!<br/><br/>Join me on one or all of my journeys, I welcome you aboard!</p>
				</div>
			</div>
			<Shop />
		</div>
	)
}

export default Profile