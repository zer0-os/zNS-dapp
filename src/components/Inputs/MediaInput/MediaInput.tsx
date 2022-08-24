import { useRef } from 'react';

//- Style Imports
import styles from './MediaInput.module.scss';

type MediaInputProps = {
	previewImage: string;
	mediaType: string | undefined;
	hasError: boolean;
	onChange: (mediaType: string, previewImage: string, image: Buffer) => void;
};

const MediaInput: React.FC<MediaInputProps> = ({
	previewImage,
	mediaType,
	hasError,
	onChange,
}) => {
	const inputFile = useRef<HTMLInputElement>(null);

	const openUploadDialog = () =>
		inputFile.current ? inputFile.current.click() : null;

	const onImageChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const type = event.target.files[0].type;
			if (!type.includes('image') && !type.includes('video')) return;

			// Raw data for image preview
			const url = URL.createObjectURL(event.target.files[0]);

			// Uint8Array data for sending to IPFS
			const bufferReader = new FileReader();
			bufferReader.readAsArrayBuffer(event.target.files[0]);
			bufferReader.onloadend = () =>
				onChange(
					type.includes('image') ? 'image' : 'video',
					url,
					Buffer.from(bufferReader.result as ArrayBuffer),
				);
		}
	};

	return (
		<>
			<div
				onClick={openUploadDialog}
				className={`${styles.Preview} border-rounded ${
					previewImage && styles.Uploaded
				}`}
				style={{
					borderColor: hasError ? '#d379ff' : '',
				}}
			>
				{!previewImage && <span className="glow-text-white">Choose Media</span>}
				{previewImage && mediaType === 'image' && (
					<img alt="NFT Preview" src={previewImage as string} />
				)}
				{previewImage && mediaType === 'video' && (
					<video autoPlay controls loop src={previewImage as string} />
				)}
			</div>
			<input
				style={{ display: 'none' }}
				accept="image/*,video/*,video/quicktime"
				multiple={false}
				name={'media'}
				type="file"
				onChange={onImageChanged}
				ref={inputFile}
			/>
		</>
	);
};

export default MediaInput;
