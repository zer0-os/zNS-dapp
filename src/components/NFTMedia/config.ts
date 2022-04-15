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
	}/${folder}/${hash}`;
};
