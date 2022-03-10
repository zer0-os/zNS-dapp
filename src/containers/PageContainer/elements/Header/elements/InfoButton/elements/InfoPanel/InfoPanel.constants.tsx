import discordIcon from './assets/discord.svg';
import infoIcon from './assets/info.svg';
import instagramIcon from './assets/instagram.svg';
import mediumIcon from './assets/medium.svg';
import telegramIcon from './assets/telegram.svg';
import twitterIcon from './assets/twitter.svg';
import wildIcon from './assets/wild.svg';
import zeroIcon from './assets/zero.svg';
import zineIcon from './assets/zine.svg';

export enum ZNS_INFO_KEYS {
	DISCORD = 'discord',
	INFO = 'info',
	INSTAGRAM = 'instagram',
	MEDIUM = 'medium',
	TELEGRAM = 'telegram',
	TWITTER = 'twitter',
	WILD = 'wild',
	ZERO = 'zero',
	ZINE = 'zine',
}

export const WILDER_WORLD_OPTIONS = {
	[ZNS_INFO_KEYS.WILD]: {
		label: 'Wild',
		link: 'https://www.wilderworld.com/',
		icon: wildIcon,
	},
	[ZNS_INFO_KEYS.ZERO]: {
		label: 'Zero',
		link: 'https://zer0.io/a/invite/2QJLsawJ9f7J',
		icon: zeroIcon,
	},
	[ZNS_INFO_KEYS.TWITTER]: {
		label: 'Twitter',
		link: 'https://twitter.com/WilderWorld',
		icon: twitterIcon,
	},
	[ZNS_INFO_KEYS.DISCORD]: {
		label: 'Discord',
		link: 'https://discord.com/invite/wilderworld',
		icon: discordIcon,
	},
	[ZNS_INFO_KEYS.INSTAGRAM]: {
		label: 'Instagram',
		link: 'https://www.instagram.com/wilder.world/',
		icon: instagramIcon,
	},
	[ZNS_INFO_KEYS.TELEGRAM]: {
		label: 'Telegram',
		link: 'https://t.me/wilder_world/',
		icon: telegramIcon,
	},
	[ZNS_INFO_KEYS.ZINE]: {
		label: 'Zine',
		link: 'https://zine.wilderworld.com/',
		icon: zineIcon,
	},
	[ZNS_INFO_KEYS.MEDIUM]: {
		label: 'Medium',
		link: 'https://wilderworld.medium.com/',
		icon: mediumIcon,
	},
};

export const ZERO_TECH_OPTIONS = {
	[ZNS_INFO_KEYS.INFO]: {
		label: 'About',
		link: 'https://www.zero.tech/',
		icon: infoIcon,
	},
	[ZNS_INFO_KEYS.ZERO]: {
		label: 'Zero',
		link: 'https://zer0.io/a/invite/2QJLsawJ9f7J',
		icon: zeroIcon,
	},
	[ZNS_INFO_KEYS.ZINE]: {
		label: 'Zine',
		link: 'https://www.zine.live/',
		icon: zineIcon,
	},
};

export const ZNS_OTHER_OPTIONS = [
	{
		label: 'Terms',
		link: 'https://zine.wilderworld.com/terms-and-conditions/',
	},
	{
		label: 'Privacy Policy',
		link: 'https://zine.wilderworld.com/privacy-policy/',
	},
];
