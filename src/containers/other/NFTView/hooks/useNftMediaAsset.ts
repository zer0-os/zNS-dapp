import { useState, useEffect } from 'react';
import { get, uniq } from 'lodash';
import { DisplayParentDomain, Maybe } from 'lib/types';
import { getHashFromIPFSUrl } from 'lib/ipfs';
import { checkMediaType, MediaType } from 'components/NFTMedia/config';

/**
 *  Types used in this hook
 */
type NFTMediaAsset = {
	isAvailable: boolean;
	url?: string;
};
type UseNftMediaAssetProps = {
	znsDomain: Maybe<DisplayParentDomain>;
};

type UseNftMediaAssetReturn = {
	imageAsset: NFTMediaAsset;
	image2Asset: NFTMediaAsset;
	image3Asset: NFTMediaAsset;
	videoAsset: NFTMediaAsset;
};

/**
 * Constants used in this hook
 */
const DEFAULT_NFT_MEDIA_ASSET: NFTMediaAsset = {
	isAvailable: false,
};
const DEFAULT_MEDIA_ASSETS: UseNftMediaAssetReturn = {
	imageAsset: DEFAULT_NFT_MEDIA_ASSET,
	image2Asset: DEFAULT_NFT_MEDIA_ASSET,
	image3Asset: DEFAULT_NFT_MEDIA_ASSET,
	videoAsset: DEFAULT_NFT_MEDIA_ASSET,
};

/**
 * Utils used in this hook
 */

// TODO:: it should be moved to utils function
// to separate with the hook
const parseNftMediaAsset = async (znsDomain: DisplayParentDomain) => {
	const imageAsset: NFTMediaAsset = { ...DEFAULT_NFT_MEDIA_ASSET };
	const image2Asset: NFTMediaAsset = { ...DEFAULT_NFT_MEDIA_ASSET };
	const image3Asset: NFTMediaAsset = { ...DEFAULT_NFT_MEDIA_ASSET };
	const videoAsset: NFTMediaAsset = { ...DEFAULT_NFT_MEDIA_ASSET };

	const previewImage = get(znsDomain, 'previewImage');

	// Parse preview image
	if (previewImage) {
		imageAsset.isAvailable = true;
		imageAsset.url = previewImage;
	}

	// Parse Video or Image
	const uniqueAssetUrls = uniq([
		znsDomain.animation_url,
		znsDomain.image_full,
		znsDomain.image,
		znsDomain.image_2,
		znsDomain.image_3,
	]).filter((url) => Boolean(url)) as string[];

	if (
		!uniqueAssetUrls.length ||
		(uniqueAssetUrls.length === 1 && uniqueAssetUrls[0] === imageAsset.url)
	) {
		return {
			imageAsset,
			image2Asset,
			image3Asset,
			videoAsset,
		};
	}

	const uniqueAssetMediaTypes = await Promise.all(
		uniqueAssetUrls.map((url) => checkMediaType(getHashFromIPFSUrl(url))),
	);

	for (var i = 0; i < uniqueAssetUrls.length; i++) {
		const assetUrl = uniqueAssetUrls[i];
		const mediaType = uniqueAssetMediaTypes[i];

		if (mediaType === MediaType.Image) {
			if (!imageAsset.isAvailable) {
				imageAsset.isAvailable = true;
				imageAsset.url = assetUrl;
			} else if (!image2Asset.isAvailable) {
				image2Asset.isAvailable = true;
				image2Asset.url = assetUrl;
			} else if (!image3Asset.isAvailable) {
				image3Asset.isAvailable = true;
				image3Asset.url = assetUrl;
			}
		} else if (mediaType === MediaType.Video && !videoAsset.isAvailable) {
			videoAsset.isAvailable = true;
			videoAsset.url = assetUrl;
		}
	}

	return {
		imageAsset,
		image2Asset,
		image3Asset,
		videoAsset,
	};
};

/**
 * Hook
 */
export const useNftMediaAsset = ({
	znsDomain,
}: UseNftMediaAssetProps): UseNftMediaAssetReturn => {
	const [mediaAsset, setMediaAsset] =
		useState<UseNftMediaAssetReturn>(DEFAULT_MEDIA_ASSETS);

	useEffect(() => {
		if (!znsDomain) return;

		const checkNFTMediaAsset = async () => {
			const mediaAsset: UseNftMediaAssetReturn = await parseNftMediaAsset(
				znsDomain,
			);
			setMediaAsset(mediaAsset);
		};

		checkNFTMediaAsset();
	}, [znsDomain]);

	return mediaAsset;
};
