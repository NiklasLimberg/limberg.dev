import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';

import { remarkSections } from './remark-plugins/sectionize.js';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';

import Prism from 'prismjs';
import loadLanguages from 'prismjs/components/index.js';

loadLanguages();

function escapeHtml(code) {
    return code.replace(
        /[{}`]/g,
        // (character) => ({ '{': '&#123;', '}': '&#125;', '`': '&#96;' }[character]),
        (character) => ({ '{': '&lbrace;', '}': '&rbrace;', '`': '&grave;' }[character]),
    );
}

/** @type {import('@sveltejs/kit').Config} */
export default {
    extensions: ['.svelte', '.md'],
    preprocess: [
        vitePreprocess(),
        mdsvex({
            extension: '.md',
            remarkPlugins: [ remarkSections],
            rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, {behavior: 'wrap'} ]],
            highlight: {
                async highlighter(code, langAndPath) {            
                    const [lang, path] = langAndPath.split('=');

                    const pathDiv = path ? `<div class="path">${path}</div>` : '';
                    const html = escapeHtml(Prism.highlight(code, Prism.languages[lang], lang));
                    
                    return `<pre class="prismjs">${pathDiv}<code class="language-${lang}">${html}</code></pre>`;
                },
            },
        }),
    ],

    kit: {
        adapter: adapter(),
    },
};
