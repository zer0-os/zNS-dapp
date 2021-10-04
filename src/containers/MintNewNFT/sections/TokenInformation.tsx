//- React Imports
import React, { useState, useRef, useEffect } from 'react';

//- Local Imports
import { TokenInformationType } from '../types';

//- Style Imports
import styles from '../MintNewNFT.module.css';

//- Component Imports
import { TextInput, FutureButton } from 'components';

//3D
import GenerateJpg from 'scenes/generateJpg/GenerateJpg';

type TokenInformationProps = {
	existingSubdomains: string[];
	token: TokenInformationType | null;
	onContinue: (data: TokenInformationType) => void;
	onResize: () => void;
	setNameHeader: (name: string) => void;
	setDomainHeader: (domain: string) => void;
};

type Error = {
	id: string;
	text: string;
};

const TokenInformation: React.FC<TokenInformationProps> = ({
	existingSubdomains,
	token,
	onContinue,
	onResize,
	setNameHeader,
	setDomainHeader,
}) => {
	//////////////////
	// State & Data //
	//////////////////

	const [previewImage, setPreviewImage] = useState(token?.previewImage ?? '');
	const [mediaType, setMediaType] = useState<string | undefined>(
		token?.mediaType,
	);
	const [name, setName] = useState(token ? token.name : '');
	const [story, setStory] = useState(token ? token.story : '');
	const [image, setImage] = useState(token ? token.image : Buffer.from(''));
	const [domain, setDomain] = useState(token ? token.domain : '');
	const [locked] = useState(token ? token.locked : true);
	const [errors, setErrors] = useState<Error[]>([]);
	const [model, setModel] = useState<File | undefined>();

	const [loadingThumbnail, setLoadingThumbnail] = useState(true);

	///////////////
	// Functions //
	///////////////

	const updateName = (name: string) => {
		setName(name);
		setNameHeader(name);
	};

	const updateDomain = (domain: string) => {
		setDomain(domain);
		setDomainHeader(domain);
	};

	const hasError = (id: string) => {
		return errors.filter((err: Error) => err.id === id).length > 0;
	};

	const errorText = (id: string) => {
		const errs = errors.filter((err: Error) => err.id === id);
		return errs[errs.length - 1]?.text || '';
	};

	//- Image Upload Handling
	// TODO: Split image uploads into a new component
	const inputFile = useRef<HTMLInputElement>(null);
	const openUploadDialog = () =>
		inputFile.current ? inputFile.current.click() : null;
	//CHANGE AND ADD THE TYPE FBX
	const onImageChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const type = event.target.files[0].type;
			// Raw data for image preview
			const url = URL.createObjectURL(event.target.files[0]);
			if (type.indexOf('image') > -1) {
				setMediaType('image');
			} else if (type.indexOf('video') > -1) {
				setMediaType('video');
			} else if (type.indexOf('') > -1) {
				let fileName = event.target.files[0].name;
				let extension = fileName.split('.').pop();
				console.log(extension?.toUpperCase() + ' extension selected.');
				setMediaType(extension?.toLowerCase());
				setModel(event.target.files[0]);
			} else return;
			setPreviewImage(url);

			if (type.indexOf('image') > -1 || type.indexOf('video') > -1) {
				console.log(event.target.files[0]);
				// Uint8Array data for sending to IPFS
				const bufferReader = new FileReader();
				bufferReader.readAsArrayBuffer(event.target.files[0]);
				bufferReader.onloadend = () => {
					setImage(Buffer.from(bufferReader.result as ArrayBuffer));
				};
			}
		}
	};

	//CREATE A BLOB WITH THE THUMBNAIL
	const createBlob = () => {
		if (mediaType == 'fbx' || mediaType == 'gltf') {
			var blob = new Blob([previewImage]);

			// Uint8Array data for sending to IPFS
			const bufferReader = new FileReader();
			bufferReader.readAsArrayBuffer(blob);
			bufferReader.onloadend = () => {
				setImage(Buffer.from(bufferReader.result as ArrayBuffer));
			};
			console.log('Done');
		}
	};

	useEffect(() => {
		createBlob();
	}, [previewImage]);

	const pressContinue = () => {
		// Field Validation
		const errors: Error[] = [];
		if (!name.length) errors.push({ id: 'name', text: 'NFT name is required' });
		if (!story.length) errors.push({ id: 'story', text: 'Story is required' });
		if (!image.length) errors.push({ id: 'image', text: 'Media is required' });
		if (!domain.length)
			errors.push({ id: 'domain', text: 'Domain name is required' });
		if (existingSubdomains.includes(domain))
			errors.push({ id: 'domain', text: 'Domain name already exists' });

		// Don't continue if there's errors
		if (errors.length) return setErrors(errors);

		const data: TokenInformationType = {
			name: name,
			story: story,
			previewImage: previewImage,
			mediaType: mediaType!,
			image: image,
			domain: domain,
			locked: locked,
		};
		onContinue(data);
	};

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		if (onResize) onResize();
	}, [errors, story]);

	////////////
	// Render //
	////////////

	return (
		<div className={styles.Section}>
			<form>
				<div style={{ display: 'flex' }}>
					<div
						onClick={openUploadDialog}
						className={`${styles.NFT} border-rounded ${
							previewImage && styles.Uploaded
						}`}
						style={{
							borderColor: hasError('image') ? 'var(--color-invalid)' : '',
						}}
					>
						{!previewImage && (
							<span className="glow-text-white">Choose Media</span>
						)}
						{previewImage && mediaType === 'image' && (
							<img alt="NFT Preview" src={previewImage as string} />
						)}
						{previewImage && mediaType === 'video' && (
							<video autoPlay controls loop src={previewImage as string} />
						)}
						{previewImage && (mediaType === 'gltf' || mediaType === 'fbx') && (
							<>
								<GenerateJpg
									url={previewImage as string}
									onRender={setPreviewImage}
									getLoading={(x) => setLoadingThumbnail(x)}
									type={mediaType}
								/>
								{!loadingThumbnail && (
									<img alt="NFT Preview" src={previewImage as string} />
								)}
							</>
						)}
					</div>
					<input
						style={{ display: 'none' }}
						accept="image/*,video/*,video/quicktime, .fbx, .gltf"
						multiple={false}
						name={'media'}
						type="file"
						onChange={onImageChanged}
						ref={inputFile}
					></input>
					<div className={styles.Inputs}>
						<TextInput
							placeholder={'Title'}
							onChange={(name: string) => updateName(name)}
							text={name}
							error={hasError('name')}
							errorText={errorText('name')}
						/>
						<TextInput
							placeholder={'Subdomain Name'}
							onChange={(domain: string) => updateDomain(domain)}
							text={domain}
							error={hasError('domain')}
							errorText={errorText('domain')}
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
					autosize
					multiline
					placeholder={'Story (400 characters max)'}
					style={{ marginTop: 40 }}
					onChange={(story: string) => setStory(story)}
					text={story}
					error={hasError('story')}
					errorText={errorText('story')}
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
