/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_DEFAULT_NETWORK: string;
	readonly VITE_DESCRIPTION: string;
	readonly VITE_FAVICON_CLOUDINARY: string;
	readonly VITE_NETWORK: string;
	readonly VITE_RPC_URL_1: string;
	readonly VITE_RPC_URL_4: string;
	readonly VITE_RPC_URL_42: string;
	readonly VITE_RPC_URL_5: string;
	readonly VITE_TITLE: string;
	readonly VITE_USE_DATA_STORE: string;
	readonly VITE_WALLET_CONNECT_PROJECT_ID: string;
	readonly VITE_ZNS_SHARE_BASE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
