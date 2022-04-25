// Possible media types based on
// MIME type of content
export enum MediaType {
	Image, // image/*
	Video, // video/*
	Unknown, // unhandled
}

// Relevant Cloudinary API URLs
export const cloudName = 'fact0ry';
export const folder = 'zns';
export const cloudinaryImageBaseUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${folder}/`;
export const cloudinaryVideoBaseUrl = `https://res.cloudinary.com/${cloudName}/video/upload/${folder}/`;

// Cloudinary React SDK isn't applying crop options
// to video posters automatially, so we have to generate
// them manually
export const generateVideoPoster = (hash: string, options: string) =>
	`https://res.cloudinary.com/${cloudName}/video/upload/so_0/${
		options?.length ? options + '/' : ''
	}v1/${folder}/${hash}.jpg`;

export const generateCloudinaryUrl = (
	hash: string,
	type: string,
	options?: string,
) => {
	return `https://res.cloudinary.com/${cloudName}/${type}/upload/${
		options ? options + '/' : ''
	}${folder}/${hash}`;
};

// Gets MIME type of media at URL
// Useful because our IPFS links don't have
// a file extension
export const checkMediaType = (hash: string) => {
	return new Promise((resolve) => {
		fetch(generateCloudinaryUrl(hash, 'video'), { method: 'HEAD' }).then(
			(d: Response) => {
				if (d.status === 200) {
					resolve(MediaType.Video);
				} else {
					resolve(MediaType.Image);
				}
			},
		);
	});
};
