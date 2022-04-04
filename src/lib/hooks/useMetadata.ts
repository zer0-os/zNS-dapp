import { parseDomainMetadata } from 'lib/metadata';
import { Metadata } from 'lib/types';
import { useZnsSdk } from './sdk';

type UseMetadataReturn = {
	getMetadata: (uri: string) => Promise<Metadata | undefined>;
};

/**
 * This hook is similar to useDomainMetadata, but
 * returns a method for getting metadata through the SDK
 * without using lifecycle methods.
 *
 * 30/03/2022
 * This functionality needs to exist, as currently default values
 * are not being set in the SDK - for example, domains should be biddable
 * by default, so isBiddable = undefined should be isBiddable = true
 *
 * @returns function for getting metadata through SDK
 */
const useMetadata = (): UseMetadataReturn => {
	const { instance: sdk } = useZnsSdk();

	const getMetadata = async (uri: string) => {
		const raw = await sdk.utility.getMetadataFromUri(uri);
		if (raw) {
			return parseDomainMetadata(raw);
		}
	};

	return {
		getMetadata,
	};
};

export default useMetadata;
