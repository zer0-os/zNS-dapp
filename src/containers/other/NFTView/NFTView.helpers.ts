import { ethers } from 'ethers';
import { Bid } from '@zero-tech/zauction-sdk';
import { DomainEventType } from '@zero-tech/zns-sdk/lib/types';
import { Maybe, DisplayParentDomain } from 'lib/types';
import { getHashFromIPFSUrl } from 'lib/ipfs';
import config from 'config';
import { DomainEvents } from './NFTView.types';
import {
	NFT_ASSET_URLS,
	NFT_ASSET_SHARE_KEYS,
	NFT_ASSET_SHARE_OPTIONS,
} from './NFTView.constants';

export const copyToClipboard = (content: string): void => {
	try {
		navigator?.clipboard?.writeText(content);
	} catch (e) {
		console.error(e);
	}
};

export const truncateText = (
	text: string,
	startLength: number,
	endLength: number = 4,
): string => {
	return `${text.slice(0, startLength)}...${text.slice(
		text.length - endLength,
	)}`;
};

export const getDomainAsset = async (
	znsDomain: Maybe<DisplayParentDomain>,
): Promise<string | undefined> => {
	if (znsDomain?.animation_url || znsDomain?.image_full || znsDomain?.image) {
		// Get hash from asset
		const url = (znsDomain.animation_url ||
			znsDomain.image_full ||
			znsDomain.image)!;
		const hash = getHashFromIPFSUrl(url);

		const checkUrl = (url: string) => {
			return new Promise((resolve, reject) => {
				fetch(url, { method: 'HEAD' }).then((r) => {
					if (r.ok) {
						resolve(url);
					} else {
						reject();
					}
				});
			});
		};

		try {
			const asset = await Promise.any([
				checkUrl(NFT_ASSET_URLS.VIDEO.replace(/NFT_ASSET_HASH/g, hash)),
				checkUrl(NFT_ASSET_URLS.IMAGE.replace(/NFT_ASSET_HASH/g, hash)),
			]);

			if (typeof asset !== 'string') {
				return;
			}

			return asset;
		} catch (e) {
			console.error(e);
		}
	}
};

export const downloadDomainAsset = async (asset: string): Promise<void> => {
	try {
		fetch(asset, {
			method: 'GET',
		})
			.then((response) => {
				response.arrayBuffer().then(function (buffer) {
					const url = window.URL.createObjectURL(new Blob([buffer]));
					const link = document.createElement('a');
					link.href = url;
					link.setAttribute(
						'download',
						asset.split('/')[asset.split('/').length - 1],
					);
					document.body.appendChild(link);
					link.click();
					link.remove();
				});
			})
			.catch((err) => {
				console.error(err);
			});
	} catch (e) {
		console.error(e);
	}
};

export const shareDomainAsset = (
	domain: string,
	key: NFT_ASSET_SHARE_KEYS = NFT_ASSET_SHARE_KEYS.TWITTER,
): void => {
	const domainUrl = encodeURIComponent(`${config.baseURL}/${domain}`);

	window.open(
		NFT_ASSET_SHARE_OPTIONS[key].URL.replace(
			/NFT_ASSET_DOMAIN_URL/g,
			domainUrl,
		),
		'',
		NFT_ASSET_SHARE_OPTIONS[key].OPTIONS,
	);
};

export const sortBidsByAmount = (bids: Bid[], asc: boolean = true): Bid[] => {
	return bids.sort((a, b) =>
		asc
			? Number(ethers.utils.formatEther(b.amount)) -
			  Number(ethers.utils.formatEther(a.amount))
			: Number(ethers.utils.formatEther(a.amount)) -
			  Number(ethers.utils.formatEther(b.amount)),
	);
};

export const sortHistoriesByTimestamp = (
	histories: DomainEvents[],
	asc: boolean = true,
): DomainEvents[] => {
	return histories.sort((a: DomainEvents, b: DomainEvents) => {
		const aVal =
			a.type === DomainEventType.bid
				? Number(a.timestamp)
				: Number(a.timestamp) * 1000;
		const bVal =
			b.type === DomainEventType.bid
				? Number(b.timestamp)
				: Number(b.timestamp) * 1000;

		return asc ? bVal - aVal : aVal - bVal;
	});
};
