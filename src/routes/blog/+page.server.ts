import type { PageServerLoad } from './$types';

async function getPosts() {
    const postImports = Object.entries(import.meta.glob('/posts/*.md'));
    const posts = [];

    for await (const [path, importPost ] of postImports) {
        const post = await importPost() as { metadata: { title: string, description: string, date: string }};
        const { title, description, date } = post.metadata;

        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });


        posts.push({
            path: path.replace('/posts/', '/blog/').replace('.md', ''),
            title,
            date: formattedDate,
            description,
        });
    }

    return posts;
}

export const load = (async () => {
    return {
        posts: await getPosts(),
    };
}) satisfies PageServerLoad;