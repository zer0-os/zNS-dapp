import emoji from 'remark-emoji';
import remarkGemoji from 'remark-gemoji';

// TODO:: We can add more plugins here

// We added emoji plugins here for now
// REF - https://github.com/remarkjs/remark/blob/main/doc/plugins.md#list-of-plugins
export const REMARK_PLUGINS = [emoji, remarkGemoji];

// REF - https://github.com/rehypejs/rehype/blob/main/doc/plugins.md#list-of-plugins
export const REHYPE_PLUGINS = [];
