import { useState } from 'react';
import { isNil } from 'lodash';
import { DisplayDomain, Maybe } from 'lib/types';

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
	const [errors, setErrors] = useState<Error[]>([]);
	/* Switches */
	const [mintRequestOn, setMintRequestOn] = useState<boolean>(false);
	const [biddingOn, setBiddingOn] = useState<boolean>(false);
	const [buyNowOn, setBuyNowOn] = useState<boolean>(false);
	const [displayGridOn, setDisplayGridOn] = useState<boolean>(false);
	const [customAspectRatioOn, setCustomAspectRatioOn] =
		useState<boolean>(false);
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
			buyNowOn,
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
			setBuyNowOn,
			setDisplayGridOn,
			setCustomAspectRatioOn,
			setLockMetadataOn,
		},
	};
};
