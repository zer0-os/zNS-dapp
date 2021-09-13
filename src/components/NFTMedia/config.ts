// Relevant Cloudinary API URLs
export const cloudName = 'fact0ry';
export const folder = 'zns';
export const cloudinaryImageBaseUrl = `https://res.cloudinary.com/${cloudName}/image/upload/v1/${folder}/`;
export const cloudinaryVideoBaseUrl = `https://res.cloudinary.com/${cloudName}/video/upload/v1/${folder}/`;

// Cloudinary React SDK isn't applying crop options
// to video posters automatially, so we have to generate
// them manually
export const generateVideoPoster = (hash: string, options: string) =>
	`https://res.cloudinary.com/${cloudName}/video/upload/${
		options?.length ? options + '/' : ''
	}v1/${folder}/${hash}.jpg`;

export const generateCloudinaryUrl = (
	hash: string,
	type: string,
	options?: string,
) => {
	return `https://res.cloudinary.com/${cloudName}/${type}/upload/${
		options ? options + '/' : ''
	}v1631501273/${folder}/${hash}`;
};
