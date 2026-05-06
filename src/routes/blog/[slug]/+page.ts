import type { Component } from 'svelte';
import type { PageLoad } from './$types';
import type { Metadata } from '$lib/types/metadata';
import { error } from '@sveltejs/kit';

type PostModule = {
    default: Component;
    metadata: Metadata;
};

export const load = (async ({ params }) => {
    try {
        const post = await import(`../../../../posts/${params.slug}.md`) as PostModule;

        return {
            content: post.default,
            metadata: post.metadata,
        };
    } catch (e) {
        if (e instanceof Error && e.message.startsWith('Unknown variable dynamic import:')) {
            error(404, { message: 'Not found' });
        }

        error(500, { message: 'Internal server error' });
    }
}) satisfies PageLoad;
