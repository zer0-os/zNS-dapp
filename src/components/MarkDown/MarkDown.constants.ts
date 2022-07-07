export enum MARKDOWN_EDITOR_MODES {
	LIVE = 'live', // this is splited mode with (edit + preview) and we will disable it in our app
	EDIT = 'edit',
	PREVIEW = 'preview',
}

export const MARKDOWN_EDITOR_TOOLBAR_TITLES = {
	[MARKDOWN_EDITOR_MODES.EDIT]: 'Edit',
	[MARKDOWN_EDITOR_MODES.PREVIEW]: 'Preview',
};
