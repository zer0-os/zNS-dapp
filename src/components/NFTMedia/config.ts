const cloudinary = 'fact0ry';
const folder = 'zns';
export const cloudinaryImageBaseUrl = `https://res.cloudinary.com/${cloudinary}/image/upload/v1/${folder}/`;
export const cloudinaryVideoBaseUrl = `https://res.cloudinary.com/${cloudinary}/video/upload/v1/${folder}/`;

export const generateVideoPoster = (hash: string, options: string) =>
	`https://res.cloudinary.com/${cloudinary}/video/upload/${
		options?.length ? options + '/' : ''
	}v1/${folder}/${hash}.jpg`;
