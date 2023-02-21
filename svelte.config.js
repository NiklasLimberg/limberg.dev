import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';

import { remarkSections } from './remark-plugins/sectionize.js';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';

import shiki, { getHighlighter } from 'shiki';

function escapeHtml(code) {
    return code.replace(
        /[{}`]/g,
        // (character) => ({ '{': '&#123;', '}': '&#125;', '`': '&#96;' }[character]),
        (character) => ({ '{': '&lbrace;', '}': '&rbrace;', '`': '&grave;' }[character]),
    );
}

const shikiHighlighter = await getHighlighter({
    theme: 'nord',
});


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

                    const tokens = shikiHighlighter.codeToThemedTokens(code, lang);
                    const html = escapeHtml(shiki.renderToHtml(tokens, {
                        lang,
                        fg: shikiHighlighter.getForegroundColor('nord'), 
                        bg: shikiHighlighter.getBackgroundColor('nord'),
                        elements: {
                            pre({ className, style, children }) {
                                return `<pre class="${className}" style="${style}">${pathDiv}${children}</pre>`;
                            },
                        },
                    }));
                    
                    return html;
                },
            },
        }),
    ],

    kit: {
        adapter: adapter(),
    },
};
