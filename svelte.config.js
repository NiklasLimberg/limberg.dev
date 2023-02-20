import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import { remarkSections } from './remark-plugins/sectionize.js';

/** @type {import('@sveltejs/kit').Config} */
export default {
    extensions: ['.svelte', '.md'],
    preprocess: [
        vitePreprocess(),
        mdsvex({
            extension: '.md',
            remarkPlugins: [remarkSections],
        }),
    ],

    kit: {
        adapter: adapter(),
    },
};
