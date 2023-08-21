import type { PageLoad } from './$types';
import type { Metadata } from '$lib/types/metadata';
import { error } from '@sveltejs/kit';

export const load = (async ({ params }) => {
    let post = null;
    try {

        post = await import(`../../../../posts/${params.slug}.md`);
    } catch (e) {
        throw error(404, {
            message: 'Not found',
        });
    }

    return {
        content: post.default,
        metadata: post.metadata as Metadata,
    };
}) satisfies PageLoad;
