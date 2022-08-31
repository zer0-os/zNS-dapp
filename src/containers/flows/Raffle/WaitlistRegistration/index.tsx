import { useState } from 'react';

import WaitlistRegistration from './WaitlistRegistration';

const WaitlistContainer = () => {
	const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

	const submitEmail = (email: string): Promise<boolean> => {
		return new Promise((resolve) => {
			fetch('https://zns-mail-microservice.herokuapp.com/cribs', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email: email }),
			})
				.then((r) => {
					resolve(r.ok);
					setHasSubmitted(true);
				})
				.catch((e) => {
					resolve(false);
					console.error(e);
				});
		});
	};

	return (
		<WaitlistRegistration hasSubmitted={hasSubmitted} onSubmit={submitEmail} />
	);
};

export default WaitlistContainer;
