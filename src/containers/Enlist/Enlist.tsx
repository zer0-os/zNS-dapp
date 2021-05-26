import React, { useState, FC } from 'react';

//- Style Imports
import styles from './Enlist.module.css';

//- Component Imports
import {
	StepBar,
	ToggleSection,
	TextInput,
	FutureButton,
	Image,
} from 'components';

//- Library Imports
import { randomName } from 'lib/Random';

const wildToUsd = 0.5; // Just a template for now

type EnlistProps = {
	domainId: string;
	domainName: string;
	minterName: string;
	image: string;
	onSubmit: () => void;
};

const Enlist: React.FC<EnlistProps> = ({
	domainId,
	domainName,
	minterName,
	image,
	onSubmit,
}) => {
	// State
	const [emailAddress, setEmailAddress] = useState('');
	const [reasonForPurchase, setReasonForPurchase] = useState('');
	const [bidUsd, setBidUsd] = useState(0);
	const [errors, setErrors] = useState<string[]>([]);

	// Form validation
	const isEmail = (text: string) =>
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
			String(text).toLowerCase(),
		);
	const valid =
		isEmail(emailAddress) && reasonForPurchase.length > 0 && bidUsd > 0;

	const submit = () => {
		// Do some validation here
		const e = [];
		if (!isEmail(emailAddress)) e.push('email');
		if (reasonForPurchase.length <= 0) e.push('reason');
		if (bidUsd <= 0) e.push('bid');
		setErrors(e);
		if (e.length === 0) onSubmit();
	};

	return (
		<div className={`${styles.Enlist} blur border-rounded border-primary`}>
			<div className={styles.Header}>
				<h1 className={`glow-text-white`}>Enlist To Purchase</h1>
				<div>
					<h2 className={`glow-text-white`}>0://{domainName}</h2>
					<span>By {randomName(minterName)}</span>
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
							type="number"
							placeholder={'Bid (USD)'}
							style={{ height: 48 }}
							text={bidUsd.toString()}
							error={errors.includes('bid')}
							onChange={(text: string) =>
								setBidUsd(text == '' ? 0 : parseFloat(text))
							}
						/>
						<span className={styles.Bid}>
							{Number(bidUsd.toFixed(2)).toLocaleString()} WILD
						</span>
					</div>
					<div
						className={`${styles.NFT} border-rounded`}
						// Template NFT for now
						// style={{ backgroundImage: `url(${image})` }}
					>
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
				onClick={submit}
			>
				Submit
			</FutureButton>
		</div>
	);
};

export default Enlist;
