import { useState } from 'react';
import { isNil } from 'lodash';
import { DisplayDomain, Maybe } from 'lib/types';
import { DomainSettingsError } from '../DomainSettingsBody.constants';

export const useDomainSettingsBodyData = (
	currentDomain: Maybe<DisplayDomain>,
) => {
	const [name, setName] = useState<string>(currentDomain?.title || '');
	const [domain, setDomain] = useState<string>(
		currentDomain?.name
			.replace(currentDomain.parent?.name || '', '')
			.replace('.', '') || '',
	);
	const [story, setStory] = useState<string>(currentDomain?.description || '');
	const [locked] = useState<boolean>(
		isNil(currentDomain?.isLocked) ? true : Boolean(currentDomain?.isLocked),
	);
	const [errors, setErrors] = useState<DomainSettingsError>({});
	/* Switches */
	const [mintRequestOn, setMintRequestOn] = useState<boolean>(false);
	// Domain bidding
	const [biddingOn, setBiddingOn] = useState<boolean>(false);
	//// Domain bidding -> sub settings
	const [bidExpiryOn, setBidExpiryOn] = useState<boolean>(false);
	const [bidExpireTime, setBidExpireTime] = useState<string>('');
	const [auctionEndtimeOn, setAuctionEndtimeOn] = useState<boolean>(false);
	const [auctionEndtime, setAuctionEndtime] = useState<string>('');
	const [auctionMessage, setAuctionMessage] = useState<string>('');
	// Buy Now
	const [buyNowOn, setBuyNowOn] = useState<boolean>(false);
	//// Buy Now -> sub settings
	const [buyNowPrice, setBuyNowPrice] = useState<string>('');
	// Display domain grid
	const [displayGridOn, setDisplayGridOn] = useState<boolean>(false);
	// Custom aspect ratio
	const [customAspectRatioOn, setCustomAspectRatioOn] =
		useState<boolean>(false);
	// Lock Metadata
	const [lockMetadataOn, setLockMetadataOn] = useState<boolean>(false);

	return {
		localState: {
			name,
			domain,
			story,
			locked,
			errors,
			/* Switches */
			mintRequestOn,
			biddingOn,
			bidExpiryOn,
			bidExpireTime,
			auctionEndtimeOn,
			auctionEndtime,
			auctionMessage,
			buyNowOn,
			buyNowPrice,
			displayGridOn,
			customAspectRatioOn,
			lockMetadataOn,
		},
		localActions: {
			setName,
			setDomain,
			setStory,
			setErrors,
			/* Switches */
			setMintRequestOn,
			setBiddingOn,
			setBidExpiryOn,
			setBidExpireTime,
			setAuctionEndtimeOn,
			setAuctionEndtime,
			setAuctionMessage,
			setBuyNowOn,
			setBuyNowPrice,
			setDisplayGridOn,
			setCustomAspectRatioOn,
			setLockMetadataOn,
		},
	};
};
