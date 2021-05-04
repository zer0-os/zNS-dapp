import React from 'react'

import OfferStyle from '../styles/Offer.module.css'
import ButtonStyle from '../styles/Button.module.css'

import coronalisa from './assets/nft-image-coronalisa.png'

const Offer = (props) => {

	const { data } = props
	// who - Who's the offer from
	// nft - What the offer is on
	// amountFiat - Amount in $
	// amountCrypto - Amount in crypto


	return(
		<div className={OfferStyle.offer}>
			<div className={OfferStyle.newOffer}>
				<h3>New Offer</h3>
				<img src={coronalisa} />
				<br/>
				<p style={{marginTop: 16, paddingBottom: 24}}>{data.who} has made an offer on “{data.nft}”</p>
				<span className={OfferStyle.offerFiat}>{data.amountFiat}</span><br/>
				<span>(Ξ${data.amountCrypto})</span>
			</div>
			<div className={OfferStyle.acceptDecline}>
				<div>
					<button className={ButtonStyle.decline}>Decline</button>
					<button className={ButtonStyle.accept}>Accept</button>
				</div>
				<a>Go to offers</a>
			</div>
		</div>
	)

}

export default Offer