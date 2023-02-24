import type { PageServerLoad } from './$types';

import { getPosts } from '$lib/posts/getPosts';

export const load = (async () => {
    return {
        posts: await getPosts(),
    };
}) satisfies PageServerLoad;
