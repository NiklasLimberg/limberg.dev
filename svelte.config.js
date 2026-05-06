import adapter from '@sveltejs/adapter-cloudflare';
import { mdsvex } from 'mdsvex';
import { codeToHtml } from 'shiki';

import { remarkSections } from './remark-plugins/sectionize.js';
import { buildToc } from './remark-plugins/extract-toc.js';

function escapeSvelte(html) {
    return html.replace(
        /[{}`]/g,
        (character) => ({ '{': '&lbrace;', '}': '&rbrace;', '`': '&grave;' }[character]),
    );
}

/** @type {import('@sveltejs/kit').Config} */
export default {
    extensions: ['.svelte', '.md'],
    preprocess: [
        mdsvex({
            extension: '.md',
            remarkPlugins: [remarkSections, buildToc],
            highlight: {
                async highlighter(code, langAndPath = '') {
                    const [lang, path] = langAndPath.split('=');

                    const html = await codeToHtml(code, {
                        lang: lang || 'text',
                        theme: 'dark-plus',
                    });

                    const withPath = path
                        ? html.replace(/(<pre[^>]*>)/, `$1<div class="path">${path}</div>`)
                        : html;

                    return escapeSvelte(withPath);
                },
            },
        }),
    ],

    kit: {
        adapter: adapter(),
    },
};
