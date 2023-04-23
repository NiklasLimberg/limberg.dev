import type { PageLoad } from './$types';
import type { Metadata } from '$lib/types/metadata';

export const load = (async ({ params }) => {
    const post = await import(`../../../../posts/${params.slug}.md`);

    return {
        content: post.default,
        metadata: post.metadata as Metadata,
    };
}) satisfies PageLoad;
