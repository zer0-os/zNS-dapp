export const DEFAULT_NOTIFICATION_DURATION = 3000; // ms

export enum WALLET_NOTIFICATIONS {
	CONNECTED = 'Wallet connected.',
	DISCONNECTED = 'Wallet disconnected.',
}

export enum MINTING_FLOW_NOTIFICATIONS {
	STARTED_MINTING = 'Started minting',
	REFRESH = 'You may need to refresh this page to see your newly minted NFTs',
	MINT_SUCCESSFUL = 'Successfully minted your Kicks. Open your Profile to view it',
	FINISH_MINTING = 'Finished minting',
	INVALID_DOMAIN_NAME = 'Invalid domain name:',
	INVALID_PROMPT_LABEL = '(Uppercase characters)',
}
