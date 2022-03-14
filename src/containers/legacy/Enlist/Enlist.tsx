import React, { useState, useEffect } from 'react';

//- Style Imports
import styles from './Enlist.module.scss';

//- Component Imports
import { TextInput, FutureButton, Image } from 'components';

//- Library Imports
import { getMetadata } from 'lib/metadata';
import useEnlist from 'lib/hooks/useEnlist';
import { EnlistSubmitParams } from 'lib/providers/EnlistProvider';

type EnlistProps = {
	onSubmit: () => void;
};

const Enlist: React.FC<EnlistProps> = ({ onSubmit }) => {
	const { enlisting, submit } = useEnlist();

	// State
	const [image, setImage] = useState('');
	const [emailAddress, setEmailAddress] = useState('');
	const [reasonForPurchase, setReasonForPurchase] = useState('');
	const [bidUsd, setBidUsd] = useState('');
	const [errors, setErrors] = useState<string[]>([]);

	// Form validation
	const isEmail = (text: string) =>
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
			String(text).toLowerCase(),
		);
	const valid =
		isEmail(emailAddress) &&
		reasonForPurchase.length > 0 &&
		bidUsd.length > 0 &&
		parseFloat(bidUsd) > 0;

	const clickSubmit = async () => {
		// Do some validation here
		const e = [];
		if (!isEmail(emailAddress)) e.push('email');
		if (reasonForPurchase.length <= 0) e.push('reason');
		if (bidUsd.length > 0 && parseFloat(bidUsd) > 0) e.push('bid');
		setErrors(e);

		if (e.length === 0) {
			const params: EnlistSubmitParams = {
				email: emailAddress,
				reason: reasonForPurchase,
				bid: parseFloat(bidUsd),
			};

			await submit(params);
			onSubmit();
		}
	};

	useEffect(() => {
		if (!enlisting || !enlisting.metadata) return;

		getMetadata(enlisting.metadata).then((metadata) => {
			if (!metadata) return;
			setImage(metadata.image);
		});
	}, [enlisting]);

	return (
		<div
			className={`${styles.Enlist} border-rounded border-primary background-primary`}
		>
			<div className={styles.Header}>
				<h1 className={`glow-text-white`}>Join Waitlist</h1>
				<div>
					<h2 className={`glow-text-white`}>0://{enlisting?.name || ''}</h2>
				</div>
			</div>
			<hr className="glow" />

			<form className={styles.Section}>
				<div style={{ display: 'flex' }}>
					<div className={styles.Inputs}>
						<TextInput
							placeholder={'Email Address'}
							style={{ height: 48 }}
							text={emailAddress}
							error={errors.includes('email')}
							onChange={(text: string) => setEmailAddress(text)}
						/>
						<TextInput
							placeholder={'Reason for purchase'}
							multiline
							style={{ height: 79 }}
							text={reasonForPurchase}
							error={errors.includes('reason')}
							onChange={(text: string) => setReasonForPurchase(text)}
						/>
						<TextInput
							placeholder={'Offer (WILD)'}
							onChange={(amount: string) => setBidUsd(amount)}
							text={bidUsd}
							style={{ height: 48 }}
							error={errors.includes('bid')}
							numeric
						/>
					</div>
					<div className={`${styles.NFT} border-rounded`}>
						<Image src={image} />
					</div>
				</div>
			</form>
			<FutureButton
				glow={valid}
				style={{
					height: 36,
					borderRadius: 18,
					textTransform: 'uppercase',
					margin: '47px auto 0 auto',
				}}
				onClick={clickSubmit}
			>
				Submit
			</FutureButton>
		</div>
	);
};

export default Enlist;
