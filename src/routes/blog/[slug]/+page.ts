import type { PageLoad } from './$types';
import type { Metadata } from '$lib/types/metadata';
import { error } from '@sveltejs/kit';

export const load = (async ({ params }) => {
    try {
        const post = await import(`../../../../posts/${params.slug}.md`);

        return {
            content: post.default,
            metadata: post.metadata as Metadata,
        };
    } catch (e) {
        if (e instanceof Error && e.message.startsWith('Unknown variable dynamic import:')) {
            throw error(404, {
                message: 'Not found',
            });
        }

        throw error(500, {
            message: 'Internal server error',
        });
    }
}) satisfies PageLoad;
