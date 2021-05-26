import fleekStorage from '@fleekhq/fleek-storage-js';

class FleekStorage {
	constructor(private apiKey: string, private apiSecret: string) {}
	upload(key: string, data: any) {
		return fleekStorage.upload({
			apiKey: this.apiKey,
			apiSecret: this.apiSecret,
			key,
			data,
		});
	}
}

const ipfs = new FleekStorage(
	process.env.REACT_APP_FLEEK_API_KEY!,
	process.env.REACT_APP_FLEEK_API_SECRET!,
);

export default ipfs;
