//- React Imports
import React, { useState, useRef } from 'react';

//- Local Imports
import { TokenInformationType } from '../types';

//- Style Imports
import styles from '../MintNewNFT.module.css';

//- Component Imports
import { TextInput, FutureButton } from 'components';

type TokenInformationProps = {
	token: TokenInformationType | null;
	onContinue: (data: TokenInformationType) => void;
	setNameHeader: (name: string) => void;
	setDomainHeader: (domain: string) => void;
};

const TokenInformation: React.FC<TokenInformationProps> = ({
	token,
	onContinue,
	setNameHeader,
	setDomainHeader,
}) => {
	//- NFT Data
	const [previewImage, setPreviewImage] = useState(
		token ? token.previewImage : '',
	); // Local image for image preview
	const [name, setName] = useState(token ? token.name : '');
	const [story, setStory] = useState(token ? token.story : '');
	const [image, setImage] = useState(token ? token.image : Buffer.from(''));
	const [domain, setDomain] = useState(token ? token.domain : '');
	const [locked] = useState(token ? token.locked : true);

	const updateName = (name: string) => {
		setName(name);
		setNameHeader(name);
	};

	const updateDomain = (domain: string) => {
		setDomain(domain);
		setDomainHeader(domain);
	};

	//- Page data
	const [errors, setErrors] = useState<string[]>([]);

	//- Image Upload Handling
	// TODO: Split image uploads into a new component
	const inputFile = useRef<HTMLInputElement>(null);
	const openUploadDialog = () =>
		inputFile.current ? inputFile.current.click() : null;
	const onImageChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			// Raw data for image preview
			const reader = new FileReader();
			reader.onload = (e: any) =>
				e.target
					? setPreviewImage(e.target?.result)
					: alert('File upload failed, please try again!');
			reader.readAsDataURL(event.target.files[0]);

			// Uint8Array data for sending to IPFS
			const bufferReader = new FileReader();
			bufferReader.readAsArrayBuffer(event.target.files[0]);
			bufferReader.onloadend = () =>
				setImage(Buffer.from(bufferReader.result as ArrayBuffer));
		}
	};

	const pressContinue = () => {
		// Do some validation
		const errors: string[] = [];
		if (!name.length) errors.push('name');
		if (!story.length) errors.push('story');
		if (!image.length) errors.push('image');
		if (!domain.length) errors.push('domain');
		// Don't continue if there's errors
		if (errors.length) return setErrors(errors);

		const data: TokenInformationType = {
			name: name,
			story: story,
			previewImage: previewImage,
			image: image,
			domain: domain,
			locked: locked,
		};
		onContinue(data);
	};

	return (
		<div className={styles.Section}>
			<form>
				<div style={{ display: 'flex' }}>
					<div
						onClick={openUploadDialog}
						className={`${styles.NFT} border-rounded border-blue`}
						style={{
							borderColor: errors.includes('image')
								? 'var(--color-invalid)'
								: '',
						}}
					>
						{!previewImage && (
							<span className="glow-text-white">Choose Media</span>
						)}
						{previewImage && (
							<img alt="NFT Preview" src={previewImage as string} />
						)}
					</div>
					<input
						style={{ display: 'none' }}
						accept="image/*"
						multiple={false}
						name={'image'}
						type="file"
						onChange={onImageChanged}
						ref={inputFile}
					></input>
					<div className={styles.Inputs}>
						<TextInput
							placeholder={'Title'}
							onChange={(name: string) => updateName(name)}
							text={name}
							error={errors.includes('name')}
						/>
						<TextInput
							placeholder={'Subdomain Name'}
							onChange={(domain: string) => updateDomain(domain)}
							text={domain}
							error={errors.includes('domain')}
							alphanumeric
						/>
						{/* <ToggleButton
							toggled={locked}
							onClick={() => setLocked(!locked)}
							style={{ marginTop: 'auto', alignSelf: 'center' }}
							labels={['Unlocked', 'Locked']}
						/> */}
					</div>
				</div>
				<TextInput
					multiline={true}
					placeholder={'Story (400 characters max)'}
					style={{ height: 200, marginTop: 40 }}
					onChange={(story: string) => setStory(story)}
					text={story}
					error={errors.includes('story')}
				/>
			</form>
			<FutureButton
				style={{ margin: '80px auto 0 auto', height: 36, borderRadius: 18 }}
				onClick={pressContinue}
				glow
			>
				Continue
			</FutureButton>
		</div>
	);
};

export default TokenInformation;
