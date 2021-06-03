export async function getMetadata(metadataUrl: string) {
	try {
		const response = await fetch(metadataUrl);
		const data = await response.json();
		return {
			title: data.name || data.title,
			description: data.description,
			image: data.image,
		};
	} catch (e) {
		console.error('Failed to retrieve metadata from ' + metadataUrl);
		return;
	}
}
