export const cloudName = 'fact0ry';
export const folder = 'zns';
export const cloudinaryImageBaseUrl = `https://res.cloudinary.com/${cloudName}/image/upload/v1/${folder}/`;
export const cloudinaryVideoBaseUrl = `https://res.cloudinary.com/${cloudName}/video/upload/v1/${folder}/`;

export const generateVideoPoster = (hash: string, options: string) =>
	`https://res.cloudinary.com/${cloudName}/video/upload/${
		options?.length ? options + '/' : ''
	}v1/${folder}/${hash}.jpg`;
