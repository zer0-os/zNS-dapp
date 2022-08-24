/* eslint-disable react-hooks/exhaustive-deps */
//- React Imports
import React, { useState, useEffect } from 'react';

//- Local Imports
import { TokenInformationType } from '../types';

//- Style Imports
import styles from '../MintNewNFT.module.scss';

//- Component Imports
import { TextInput, FutureButton, MediaInput } from 'components';

type TokenInformationProps = {
	existingSubdomains: string[];
	token: TokenInformationType | null;
	onContinue: (data: TokenInformationType) => void;
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

	const handleMediaChange = (
		mediaType: string,
		previewImage: string,
		image: Buffer,
	): void => {
		setMediaType(mediaType);
		setPreviewImage(previewImage);
		setImage(image);
	};

	const pressContinue = () => {
		// Field Validation
		const errors: Error[] = [];
		if (!name.length) {
			errors.push({ id: 'name', text: 'NFT name is required' });
		}
		if (!story.length) {
			errors.push({ id: 'story', text: 'Story is required' });
		}
		if (!image.length) {
			errors.push({ id: 'image', text: 'Media is required' });
		}
		if (!domain.length) {
			errors.push({ id: 'domain', text: 'Domain name is required' });
		}
		if (/[A-Z]/.test(domain)) {
			errors.push({ id: 'domain', text: 'Domain name must be lower case' });
		}
		if (existingSubdomains.includes(domain)) {
			errors.push({ id: 'domain', text: 'Domain name already exists' });
		}

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
		// @todo refactor
		if (/[A-Z]/.test(domain)) {
			setErrors([
				...errors,
				{ id: 'domain', text: 'Domain name must be lower case' },
			]);
		} else {
			setErrors(
				errors.filter((e) => e.text !== 'Domain name must be lower case'),
			);
		}
	}, [domain]);

	////////////
	// Render //
	////////////

	return (
		<div className={styles.Section}>
			<form>
				<div className={styles.FlexWrapper}>
					<MediaInput
						previewImage={previewImage}
						mediaType={mediaType}
						hasError={hasError('image')}
						onChange={handleMediaChange}
					/>
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
							maxLength={25}
						/>
					</div>
				</div>
				<TextInput
					autosize
					multiline
					placeholder={'Story (400 characters max)'}
					className={styles.TextStoryInput}
					onChange={(story: string) => setStory(story)}
					text={story}
					error={hasError('story')}
					errorText={errorText('story')}
				/>
			</form>
			<FutureButton
				className={styles.SubmitButton}
				onClick={pressContinue}
				glow
			>
				Continue
			</FutureButton>
		</div>
	);
};

export default TokenInformation;
